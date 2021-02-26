/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  cropScheduleDMToMonthDM,
  ScheduleDataModel,
} from "../../common-models/schedule-data.model";
import xlsx, { Cell } from "exceljs";
import { ShiftCode } from "../../common-models/shift-info.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";
import { WorkerType } from "../../common-models/worker-info.model";
import {
  ChildrenSectionKey,
  ExtraWorkersSectionKey,
  MetaDataRowLabel,
  MetaDataSectionKey,
} from "../section.model";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { ColorHelper } from "../../helpers/colors/color.helper";
import { Color } from "../../helpers/colors/color.model";
import { TranslationHelper } from "../../helpers/translations.helper";
import { VerboseDate } from "../../common-models/month-info.model";
import { ShiftsInfoLogic } from "../schedule-logic/shifts-info.logic";
import { MetadataLogic } from "../schedule-logic/metadata.logic";

const EMPTY_ROW = Array(100).fill("");

export class ScheduleExportLogic {
  constructor(
    private scheduleModel: ScheduleDataModel,
    private overtimeExport: boolean = true,
    private extraWorkersExport?: boolean
  ) {}

  static readonly WORKSHEET_NAME = "grafik";
  requiredHoursAddress;
  doneHoursAddress;
  diffHoursAddress;

  public formatAndSave(filename: string): void {
    const [workbook, workSheet] = ScheduleExportLogic.createWorkArea();

    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;

    const headerRow = this.createHeader(this.scheduleModel);
    const datesSection = ScheduleExportLogic.createDatesSection(this.scheduleModel);
    const extraWorkersSection = ScheduleExportLogic.createExtraWorkersSection(this.scheduleModel);
    const childrenInfoSection = ScheduleExportLogic.createChildrenInfoSection(this.scheduleModel);
    const overtimeInfoHeader = ScheduleExportLogic.createWorkHoursInfoHeader(
      childrenInfoSection[0].length
    );
    const [nurseShifts, babysitterShifts] = this.createShiftsSections(this.scheduleModel);
    const schedule: (
      | string[]
      | (number | ExtraWorkersSectionKey | MetaDataSectionKey | ChildrenSectionKey)[]
    )[] = [headerRow, ...datesSection];
    if (this.extraWorkersExport) {
      schedule.push(...extraWorkersSection);
    } else {
      schedule.push(EMPTY_ROW);
    }
    schedule.push(...childrenInfoSection);
    if (this.overtimeExport) {
      schedule.push(overtimeInfoHeader);
    }

    schedule.push(
      ...nurseShifts,
      EMPTY_ROW,
      ...babysitterShifts,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW
    );

    this.addStyles(workSheet, schedule);

    workSheet.mergeCells("B1:AF1");
    workSheet.mergeCells(
      this.requiredHoursAddress.slice(0, this.requiredHoursAddress.length - 1) +
        "2:" +
        this.requiredHoursAddress
    );
    workSheet.mergeCells(
      this.doneHoursAddress.slice(0, this.doneHoursAddress.length - 1) +
        "2:" +
        this.doneHoursAddress
    );
    workSheet.mergeCells(
      this.diffHoursAddress.slice(0, this.diffHoursAddress.length - 1) +
        "2:" +
        this.diffHoursAddress
    );
    workSheet.getCell(this.requiredHoursAddress).value = "Wymagane";
    workSheet.getCell(this.doneHoursAddress).value = "Wypracowane";
    workSheet.getCell(this.diffHoursAddress).value = "Nadgodziny";
    workSheet.getCell(this.requiredHoursAddress).alignment = { textRotation: -90 };
    workSheet.getCell(this.doneHoursAddress).alignment = { textRotation: -90 };
    workSheet.getCell(this.diffHoursAddress).alignment = { textRotation: -90 };

    this.saveToFile(workbook, filename);
  }

  private static createWorkArea(): [xlsx.Workbook, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();
    return [
      workbook,
      workbook.addWorksheet(ScheduleExportLogic.WORKSHEET_NAME, {
        pageSetup: { paperSize: 9, orientation: "landscape" },
        properties: { defaultColWidth: 5 },
      }),
    ];
  }

  private getRightCornerIndexes(cell: Cell, cellValue: string): void {
    if (cellValue === "Godziny wymagane") {
      const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.requiredHoursAddress = cell.address;
      const letter = this.requiredHoursAddress[1];
      const secondLetter = alpha[alpha.indexOf(letter) + 1];
      const thirdLetter = alpha[alpha.indexOf(letter) + 2];
      this.doneHoursAddress =
        this.requiredHoursAddress.slice(0, 1) + secondLetter + this.requiredHoursAddress.slice(2);
      this.diffHoursAddress =
        this.requiredHoursAddress.slice(0, 1) + thirdLetter + this.requiredHoursAddress.slice(2);
    }
  }

  private addStyles(workSheet: xlsx.Worksheet, rows: unknown[]): void {
    const monthInfo = this.scheduleModel.schedule_info;
    const monthLogic = new MonthInfoLogic(
      monthInfo?.month_number || 0,
      monthInfo?.year + "" || "",
      this.scheduleModel.month_info?.dates || []
    );
    const verboseDates = monthLogic.verboseDates;
    workSheet.addRows(rows);
    workSheet.getColumn(1).width = 20;
    workSheet.eachRow((row) => {
      let isShiftRow = false;
      row.height = 18;
      row.eachCell((cell, colNumber) => {
        const cellValue = cell.value?.toString() || "";
        this.getRightCornerIndexes(cell, cellValue);
        if ((cellValue && ShiftCode[cellValue]) || isShiftRow) {
          isShiftRow = true;
          // colNumber - 1, because first column is key column
          workSheet.getColumn(colNumber).width = 4;
          cell.style = this.getShiftStyle(
            ShiftCode[cellValue] || ShiftCode.W,
            verboseDates[colNumber - 1]
          );
        }
      });
    });
  }

  private getShiftStyle(code: ShiftCode, verboseDate?: VerboseDate): Partial<xlsx.Style> {
    const shiftFillColor = ShiftHelper.getShiftColor(code, verboseDate).backgroundColor;
    const borderColor: Partial<xlsx.Border> = {
      color: { argb: this.rgbaToArgbHex(ColorHelper.getBorderColor()) },
      style: "thin",
    };
    return {
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: this.rgbaToArgbHex(shiftFillColor) },
      },
      border: {
        top: borderColor,
        bottom: borderColor,
        left: borderColor,
        right: borderColor,
      },
    };
  }

  private rgbaToArgbHex(color: Color): string {
    const toHex = (num: number): string => ("0" + num.toString(16)).slice(-2);
    const c = color;
    return `${toHex(c.a)}${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  }

  private createShiftsSections(scheduleModel: ScheduleDataModel): string[][][] {
    const shiftInfoLogics = ScheduleExportLogic.shiftInfoLogics(scheduleModel);

    const grouped = {
      [WorkerType.NURSE]: [] as string[][],
      [WorkerType.OTHER]: [] as string[][],
    };
    Object.keys(cropScheduleDMToMonthDM(scheduleModel).shifts || {}).forEach((key: string) => {
      const category = cropScheduleDMToMonthDM(scheduleModel).employee_info.type[key] ?? "";
      const shiftsRow: string[] = [
        key,
        ...cropScheduleDMToMonthDM(scheduleModel).shifts[key]?.map((s) =>
          s === ShiftCode.W ? "" : s
        ),
      ];
      if (this.overtimeExport) {
        shiftsRow.push(
          ...shiftInfoLogics[category].calculateWorkerHourInfo(key).map((e) => e.toString())
        );
      }
      grouped[category].push(shiftsRow);
    });
    return [grouped[WorkerType.NURSE], grouped[WorkerType.OTHER]];
  }

  private createHeader(scheduleModel: ScheduleDataModel): string[] {
    const headerRow = { [MetaDataRowLabel]: "" };
    headerRow[MetaDataSectionKey.Month] =
      TranslationHelper.polishMonths[scheduleModel?.schedule_info?.month_number || 0];
    headerRow[MetaDataSectionKey.Year] = scheduleModel?.schedule_info?.year || 0;
    // TODO implement work time calculation
    headerRow[MetaDataSectionKey.RequiredavailableWorkersWorkTime] = 0;
    let infoStr = Object.keys(headerRow)
      .map((key) => `${key} ${headerRow[key]}`)
      .join(", ")
      .slice(9);
    infoStr =
      infoStr.slice(0, infoStr.length - 1) +
      ShiftHelper.calculateWorkNormForMonth(
        scheduleModel?.schedule_info?.month_number,
        scheduleModel?.schedule_info?.year
      );
    return ["Grafik", infoStr];
  }

  private static createChildrenInfoSection(
    scheduleModel: ScheduleDataModel
  ): (number | ChildrenSectionKey)[][] {
    // in case if it will be more complecated section
    return [
      [
        ChildrenSectionKey.RegisteredChildrenCount,
        ...(cropScheduleDMToMonthDM(scheduleModel).month_info?.children_number || []),
      ],
    ];
  }

  private static createWorkHoursInfoHeader(startIndex: number): string[] {
    const header = Array(startIndex + 3).fill("");

    header[startIndex] = TranslationHelper.workHoursInfoHeader.requiredHours;
    header[startIndex + 1] = TranslationHelper.workHoursInfoHeader.actualHours;
    header[startIndex + 2] = TranslationHelper.workHoursInfoHeader.overtime;
    return header;
  }

  private static createExtraWorkersSection(
    scheduleModel: ScheduleDataModel
  ): (number | ExtraWorkersSectionKey)[][] {
    return [
      [
        ExtraWorkersSectionKey.ExtraWorkersCount,
        ...(cropScheduleDMToMonthDM(scheduleModel)?.month_info?.extra_workers || []),
      ],
    ];
  }

  private static createDatesSection(
    scheduleModel: ScheduleDataModel
  ): (number | MetaDataSectionKey)[][] {
    return [
      [
        MetaDataSectionKey.MonthDays,
        ...(cropScheduleDMToMonthDM(scheduleModel)?.month_info?.dates || []),
      ],
    ];
  }

  private saveToFile(workbook: xlsx.Workbook, filename: string): void {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      ScheduleExportLogic.saveFileAs(blob, filename);
    });
  }

  private static saveFileAs(blob, filename: string): void {
    const anchor = document.createElement("a");

    anchor.download = filename;
    anchor.href = URL.createObjectURL(blob);

    document.body.appendChild(anchor);

    // eslint-disable-next-line
    // @ts-ignore
    if (window.Cypress) {
      return;
    }

    anchor.click();
  }

  private static shiftInfoLogics(
    scheduleModel: ScheduleDataModel
  ): { [WorkerType.NURSE]: ShiftsInfoLogic; [WorkerType.OTHER]: ShiftsInfoLogic } {
    const metadataLogic = new MetadataLogic(
      scheduleModel.schedule_info.year?.toString(),
      scheduleModel.schedule_info.month_number,
      scheduleModel.month_info.dates
    );
    const nurseShiftsInfoLogic = new ShiftsInfoLogic(
      scheduleModel.shifts,
      WorkerType.NURSE,
      metadataLogic
    );
    const otherShiftsInfoLogic = new ShiftsInfoLogic(
      scheduleModel.shifts,
      WorkerType.OTHER,
      metadataLogic
    );

    return {
      [WorkerType.NURSE]: nurseShiftsInfoLogic,
      [WorkerType.OTHER]: otherShiftsInfoLogic,
    };
  }
}
