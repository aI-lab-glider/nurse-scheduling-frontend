/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx, { Cell } from "exceljs";
import { RevisionType } from "../../api/persistance-store.model";
import { VerboseDate } from "../../common-models/month-info.model";
import { MonthDataModel } from "../../common-models/schedule-data.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import {
  ContractTypeHelper,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import { ColorHelper } from "../../helpers/colors/color.helper";
import { Color } from "../../helpers/colors/color.model";
import { FileHelper } from "../../helpers/file.helper";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { TranslationHelper } from "../../helpers/translations.helper";
import { WorkerHourInfo } from "../../helpers/worker-hours-info.model";
import { PrimaryMonthRevisionDataModel } from "../../state/models/application-state.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";
import {
  ChildrenSectionKey,
  ExtraWorkersSectionKey,
  MetaDataRowLabel,
  MetaDataSectionKey,
} from "../section.model";

const EMPTY_ROW = Array(100).fill("");

export const WORKSHEET_NAME = "grafik";
export const WORKERS_WORKSHEET_NAME = "pracownicy";
export const SHIFTS_WORKSHEET_NAME = "zmiany";

export interface ScheduleExportLogicOptions {
  scheduleModel: MonthDataModel;
  primaryScheduleModel?: PrimaryMonthRevisionDataModel;
  overtimeExport?: boolean;
  extraWorkersExport?: boolean;
}

export class ScheduleExportLogic {
  private scheduleModel: MonthDataModel;
  private primaryScheduleModel?: PrimaryMonthRevisionDataModel;
  private overtimeExport?: boolean;
  private extraWorkersExport: boolean;

  constructor({
    scheduleModel,
    primaryScheduleModel,
    overtimeExport,
    extraWorkersExport = true,
  }: ScheduleExportLogicOptions) {
    this.scheduleModel = scheduleModel;
    this.primaryScheduleModel = primaryScheduleModel;
    this.overtimeExport = !!overtimeExport && !!primaryScheduleModel;
    this.extraWorkersExport = extraWorkersExport;
  }

  requiredHoursAddress;
  doneHoursAddress;
  diffHoursAddress;

  public formatAndSave(revisionType: RevisionType): void {
    const [finalName, workbook] = this.createWorkbook(revisionType);
    FileHelper.saveToFile(workbook, finalName);
  }

  public createWorkbook(revisionType: RevisionType): [string, xlsx.Workbook] {
    const [
      workbook,
      scheduleWorkSheet,
      workersWorkSheet,
      shiftsWorkSheet,
    ] = ScheduleExportLogic.createWorkArea();

    this.setScheduleWorkSheet(scheduleWorkSheet);
    this.setWorkersWorkSheet(workersWorkSheet);
    this.setShiftsWorkSheet(shiftsWorkSheet);

    const workbookName = FileHelper.createMonthFilename(this.scheduleModel, revisionType);
    return [workbookName, workbook];
  }

  private setScheduleWorkSheet(workSheet: xlsx.Worksheet): void {
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
    }
    schedule.push(...childrenInfoSection);
    if (this.overtimeExport) {
      schedule.push(overtimeInfoHeader);
    }

    const headerLen = schedule.length;
    const nurseLastIndex = headerLen + nurseShifts.length;
    const babysitterLastIndex = nurseLastIndex + babysitterShifts.length + 1;

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

    this.addStyles(workSheet, schedule, headerLen, nurseLastIndex, babysitterLastIndex);

    workSheet.mergeCells("B1:AF1");
    if (this.overtimeExport) {
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
    }
  }

  private setWorkersWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const workersInfoArray = ScheduleExportLogic.createWorkersInfoSection(this.scheduleModel);

    const colLens = workersInfoArray[0].map((_, colIndex) =>
      Math.max(...workersInfoArray.map((row) => row[colIndex].toString().length))
    );

    workSheet.addRows(workersInfoArray);

    colLens.forEach((len, id) => {
      workSheet.getColumn(id + 1).width = len + 4;
    });

    workSheet.getColumn(1).alignment = { vertical: "middle", horizontal: "left" };
    workSheet.getColumn(2).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(3).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(4).alignment = { vertical: "middle", horizontal: "center" };

    workSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getRow(1).font = { bold: true };
  }

  private setShiftsWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const shiftsInfoArray = ScheduleExportLogic.createShiftsInfoSection(this.scheduleModel);

    const colLens = shiftsInfoArray[0].map((_, colIndex) =>
      Math.max(...shiftsInfoArray.map((row) => row[colIndex].toString().length))
    );

    workSheet.addRows(shiftsInfoArray);

    colLens.forEach((len, id) => {
      workSheet.getColumn(id + 1).width = len + 4;
    });

    let iter;
    for (iter = 3; iter <= workSheet.rowCount; iter++) {
      const cell = workSheet.getCell(iter, 6);
      cell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: cell.text },
      };
      cell.value = "";
    }

    workSheet.getColumn(1).alignment = { vertical: "middle", horizontal: "left" };
    workSheet.getColumn(2).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(3).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(4).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(5).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getColumn(6).alignment = { vertical: "middle", horizontal: "center" };

    workSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getRow(1).font = { bold: true };
  }

  private static createWorkArea(): [xlsx.Workbook, xlsx.Worksheet, xlsx.Worksheet, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();
    return [
      workbook,
      workbook.addWorksheet(WORKSHEET_NAME, {
        pageSetup: { paperSize: 9, orientation: "landscape" },
        properties: { defaultColWidth: 5 },
      }),
      workbook.addWorksheet(WORKERS_WORKSHEET_NAME, {
        pageSetup: { paperSize: 9, orientation: "landscape" },
        properties: { defaultColWidth: 5 },
      }),
      workbook.addWorksheet(SHIFTS_WORKSHEET_NAME, {
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

  private addStyles(
    workSheet: xlsx.Worksheet,
    rows: unknown[],
    headerLen: number,
    nurseLastIndex: number,
    babysitterLastIndex: number
  ): void {
    const monthInfo = this.scheduleModel.scheduleKey;
    const monthLogic = new MonthInfoLogic(
      monthInfo?.month ?? 0,
      monthInfo?.year + "" ?? "",
      this.scheduleModel.month_info?.dates || []
    );
    const verboseDates = monthLogic.verboseDates;
    const calendarDataMargin = -2;
    workSheet.addRows(rows);
    workSheet.getColumn(1).width = 20;
    workSheet.eachRow((row, index) => {
      const isNurseRow = index > headerLen && index <= nurseLastIndex;
      const isBabysitterRow = index > nurseLastIndex + 1 && index <= babysitterLastIndex;

      if (isNurseRow || isBabysitterRow) {
        row.eachCell((cell, colNumber) => {
          const cellValue = cell.value?.toString() || "";
          cell.style = this.getShiftStyle(
            ShiftCode[cellValue] || ShiftCode.W,
            verboseDates[colNumber + calendarDataMargin]
          );
        });
      }
      row.height = 18;
      if (index === 1) {
        row.height = 40;
        row.eachCell((cell) => {
          cell.font = {
            family: 4,
            size: 28,
            bold: true,
          };
        });
      }
      let isShiftRow = false;
      row.eachCell((cell, colNumber) => {
        const cellValue = cell.value?.toString() || "";
        this.getRightCornerIndexes(cell, cellValue);
        if ((cellValue && ShiftCode[cellValue]) || isShiftRow) {
          isShiftRow = true;
          workSheet.getColumn(colNumber).width = 5;
        }
      });
    });
  }

  // the values are based on w3c recommendations.
  // We need to determine the color with the highest contrast.
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  // https://www.w3.org/TR/WCAG20/#contrast-ratiodef
  public decideBlackOrWhite(color: Color): string {
    const black = "000000";
    const white = "FFFFFF";
    const rgb = [color.r, color.b, color.g];
    const linearRgb = rgb.map((c) => {
      c = c / 255.0;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
    return luminance > 0.179 ? black : white;
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
      font: {
        color: {
          argb: this.decideBlackOrWhite(
            ShiftHelper.getShiftColor(code, verboseDate).backgroundColor
          ),
        },
      },
    };
  }

  private rgbaToArgbHex(color: Color): string {
    const toHex = (num: number): string => ("0" + num.toString(16)).slice(-2);
    const c = color;
    return `${toHex(c.a)}${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  }

  private createShiftsSections(scheduleModel: MonthDataModel): string[][][] {
    const grouped = {
      [WorkerType.NURSE]: [] as string[][],
      [WorkerType.OTHER]: [] as string[][],
    };
    Object.keys(scheduleModel.shifts || {})
      .sort()
      .forEach((workerName: string) => {
        const category = scheduleModel.employee_info.type[workerName] ?? "";
        const shiftsRow: string[] = [
          workerName,
          ...scheduleModel.shifts[workerName]?.map((s) => (s === ShiftCode.W ? "" : s)),
        ];
        if (this.overtimeExport) {
          shiftsRow.push(
            ...WorkerHourInfo.fromSchedules(workerName, scheduleModel, this.primaryScheduleModel)
              .asArray()
              .map((e) => e.toString())
          );
        }
        grouped[category].push(shiftsRow);
      });
    return [grouped[WorkerType.NURSE], grouped[WorkerType.OTHER]];
  }

  private createHeader(scheduleModel: MonthDataModel): string[] {
    const headerRow = { [MetaDataRowLabel]: "" };
    headerRow[MetaDataSectionKey.Month] =
      TranslationHelper.polishMonths[scheduleModel?.scheduleKey.month || 0];
    headerRow[MetaDataSectionKey.Year] = scheduleModel?.scheduleKey.year || 0;
    headerRow[MetaDataSectionKey.RequiredavailableWorkersWorkTime] = 0;
    let infoStr = Object.keys(headerRow)
      .map((key) => `${key} ${headerRow[key]}`)
      .join("  |  ")
      .slice(9)
      .toUpperCase();
    infoStr =
      infoStr.slice(0, infoStr.length - 2) +
      " " +
      WorkerHourInfo.calculateWorkNormForMonth(
        scheduleModel?.scheduleKey.month,
        scheduleModel?.scheduleKey.year
      );
    return ["GRAFIK", infoStr];
  }

  private static createChildrenInfoSection(
    scheduleModel: MonthDataModel
  ): (number | ChildrenSectionKey)[][] {
    // in case if it will be more complicated section
    return [
      [
        ChildrenSectionKey.RegisteredChildrenCount,
        ...(scheduleModel.month_info?.children_number || []),
      ],
    ];
  }

  private static createWorkersInfoSection(scheduleModel: MonthDataModel): (string | number)[][] {
    const names = Object.keys(scheduleModel.employee_info?.type);

    const workers: (string | number)[][] = [];

    workers.push(["Imię i nazwisko", "Stanowisko/funkcja", "Rodzaj umowy", "Wymiar czasu pracy"]);
    workers.push(EMPTY_ROW);
    names.forEach((name) =>
      workers.push([
        name,
        WorkerTypeHelper.translateToShort(scheduleModel.employee_info?.type[name]),
        ContractTypeHelper.translateToShort(scheduleModel.employee_info?.contractType!?.[name]),
        scheduleModel.employee_info?.time[name],
      ])
    );
    return [...workers];
  }

  private static createShiftsInfoSection(scheduleModel: MonthDataModel): (string | number)[][] {
    const names = Object.values(scheduleModel.shift_types);

    const workers: (string | number)[][] = [];

    workers.push(["Nazwa", "Skrót", "Od", "Do", "Zmiana pracująca", "Kolor"]);
    workers.push(EMPTY_ROW);
    names.forEach((name) =>
      workers.push([
        name.name,
        name.code,
        name.from,
        name.to,
        name.isWorkingShift === true ? "TAK" : "NIE",
        name.color,
      ])
    );
    return [...workers];
  }

  private static createWorkHoursInfoHeader(startIndex: number): string[] {
    const header = Array(startIndex + 3).fill("");

    header[startIndex] = TranslationHelper.workHoursInfoHeader.requiredHours;
    header[startIndex + 1] = TranslationHelper.workHoursInfoHeader.actualHours;
    header[startIndex + 2] = TranslationHelper.workHoursInfoHeader.overtime;
    return header;
  }

  private static createExtraWorkersSection(
    scheduleModel: MonthDataModel
  ): (number | ExtraWorkersSectionKey)[][] {
    return [
      [
        ExtraWorkersSectionKey.ExtraWorkersCount,
        ...(scheduleModel.month_info?.extra_workers || []),
      ],
    ];
  }

  private static createDatesSection(
    scheduleModel: MonthDataModel
  ): (number | MetaDataSectionKey)[][] {
    return [[MetaDataSectionKey.MonthDays, ...(scheduleModel.month_info?.dates || [])]];
  }
}
