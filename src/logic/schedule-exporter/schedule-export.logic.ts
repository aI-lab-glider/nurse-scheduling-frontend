/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";
import { RevisionType } from "../../api/persistance-store.model";
import { VerboseDate } from "../../common-models/month-info.model";
import { MonthDataModel } from "../../common-models/schedule-data.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { ContractTypeHelper, WorkerTypeHelper } from "../../common-models/worker-info.model";
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
import {
  EMPTY_ROW,
  ParserHelper,
  SHIFT_HEADERS,
  SHIFTS_WORKSHEET_NAME,
  WORKER_HEADERS,
  WORKERS_WORKSHEET_NAME,
  WORKSHEET_NAME,
} from "../../helpers/parser.helper";
import { groupWorkers } from "../../components/schedule-page/table/schedule/use-worker-groups";
import { WorkerInfo } from "../../components/namestable/use-worker-info";
import { MonthHelper } from "../../helpers/month.helper";
import * as _ from "lodash";

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

    const schedule: (
      | string[]
      | (number | ExtraWorkersSectionKey | MetaDataSectionKey | ChildrenSectionKey)[]
    )[] = [headerRow, ...datesSection];
    let foundationInfoLen = 0;

    if (this.extraWorkersExport) {
      schedule.push(...extraWorkersSection);
      foundationInfoLen++;
    }
    if (this.overtimeExport) {
      foundationInfoLen++;
    }
    schedule.push(...childrenInfoSection);
    foundationInfoLen++;

    schedule.push(EMPTY_ROW);

    const groupedWorkers = groupWorkers(this.scheduleModel);
    Object.keys(groupedWorkers).forEach((group) => {
      let groupRows = this.createGroupWorkersRows(groupedWorkers[group]);
      if (this.overtimeExport) {
        groupRows = this.extendWithOvertimeInfo(groupRows);
      }
      schedule.push(...groupRows);
      schedule.push(EMPTY_ROW);
    });

    workSheet.addRows(schedule);

    const headerLen = 1;
    const emptySpace = 1;
    const shiftSectionStartIndex = 1 + foundationInfoLen + headerLen + emptySpace; // +2 because of header
    this.styleWorksheet(workSheet, shiftSectionStartIndex);

    workSheet.mergeCells("B1:AF1");
    if (this.overtimeExport) {
      this.addOvertimeHoursLabels(workSheet);
    }
  }

  private createGroupWorkersRows(workersInfo: WorkerInfo[]): string[][] {
    const workerRows: string[][] = [];
    workersInfo.forEach((worker) => {
      const printableSifts = worker.workerShifts.map((shift) =>
        shift === ShiftCode.W ? "" : shift
      );
      workerRows.push([worker.workerName, ...printableSifts]);
    });
    return workerRows;
  }

  private extendWithOvertimeInfo(workerRows: string[][]): string[][] {
    const extendedRows: string[][] = [];
    workerRows.forEach((row) => {
      extendedRows.push([
        ...row,
        ...Object.values(
          WorkerHourInfo.fromSchedules(row[0], this.scheduleModel, this.primaryScheduleModel)
            .summary
        ),
      ]);
    });
    return extendedRows;
  }

  private setWorkersWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const workersInfoArray = ScheduleExportLogic.createWorkersInfoSection(this.scheduleModel);

    const cellMargin = 4;

    const colLens = workersInfoArray[0].map((_, colIndex) =>
      Math.max(...workersInfoArray.map((row) => row[colIndex].toString().length))
    );

    workSheet.addRows(workersInfoArray);

    colLens.forEach((len, id) => {
      workSheet.getColumn(id + 1).width = len + cellMargin;
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

    const cellMargin = 4;

    const colLens = shiftsInfoArray[0].map((_, colIndex) =>
      Math.max(...shiftsInfoArray.map((row) => row[colIndex].toString().length))
    );

    workSheet.addRows(shiftsInfoArray);

    colLens.forEach((len, id) => {
      workSheet.getColumn(id + 1).width = len + cellMargin;
    });

    const firstShiftRow = 3;
    for (let iter = firstShiftRow; iter <= workSheet.rowCount; iter++) {
      const cell = workSheet.getCell(iter, ParserHelper.getShiftColorHeaderIndex() + 1);
      cell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: cell.text },
      };
      cell.value = "";
    }

    for (let iter = 1; iter <= SHIFT_HEADERS.length; iter++) {
      if (iter - 1 === ParserHelper.getShiftNameHeaderIndex()) {
        workSheet.getColumn(iter).alignment = { vertical: "middle", horizontal: "left" };
      } else {
        workSheet.getColumn(iter).alignment = { vertical: "middle", horizontal: "center" };
      }
    }

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

  private styleWorksheet(workSheet: xlsx.Worksheet, shiftStartIndex: number): void {
    workSheet.getColumn(1).width = 20;

    workSheet.eachRow((row, index) => {
      if (index === 1) {
        ScheduleExportLogic.styleHeaderRow(row);
        return;
      }

      row.height = 18;
      if (index > shiftStartIndex && !ParserHelper.isEmptyRow(row)) {
        this.styleShiftRow(row);
      }
    });
  }

  private addOvertimeHoursLabels(workSheet: xlsx.Worksheet) {
    const { month, year } = this.scheduleModel.scheduleKey;
    const scheduleLen = MonthHelper.getMonthLength(year, month);
    let labelColumn = 1 + scheduleLen + 1;
    const labelLen = 3;
    Object.values(WorkerHourInfo.summaryTranslations).forEach((translation) => {
      const cell = workSheet.getCell(2, labelColumn);

      const cellAddress = cell.address;
      workSheet.mergeCells(2, labelColumn, 2 + labelLen - 1, labelColumn);
      cell.value = _.startCase(translation);
      workSheet.getCell(cellAddress).alignment = {
        textRotation: -90,
        vertical: "top",
        horizontal: "center",
      };
      labelColumn++;
    });
  }

  private styleShiftRow(row: xlsx.Row) {
    const { month, year } = this.scheduleModel.scheduleKey;
    const monthLogic = new MonthInfoLogic(month, year, this.scheduleModel.month_info?.dates || []);
    const verboseDates = monthLogic.verboseDates;

    const calendarDataMargin = -2;

    row.eachCell((cell, colNumber) => {
      const cellValue = cell.value?.toString() || "";
      cell.style = this.getShiftStyle(
        ShiftCode[cellValue] || ShiftCode.W,
        verboseDates[colNumber + calendarDataMargin]
      );
    });
  }

  private static styleHeaderRow(row: xlsx.Row) {
    row.height = 40;
    row.eachCell((cell) => {
      cell.font = {
        family: 4,
        size: 28,
        bold: true,
      };
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

    workers.push(WORKER_HEADERS);
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

    const shifts: (string | number)[][] = [];

    shifts.push(SHIFT_HEADERS);
    shifts.push(EMPTY_ROW);
    names.forEach((name) =>
      shifts.push([
        name.name,
        name.code,
        name.from,
        name.to,
        ParserHelper.translateBooleanToString(name.isWorkingShift).toUpperCase(),
        name.color,
      ])
    );
    return [...shifts];
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
