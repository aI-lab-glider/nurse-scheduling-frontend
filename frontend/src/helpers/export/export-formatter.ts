import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import fs from "file-saver";
import xlsx from "exceljs";
import { ShiftCode } from "../../common-models/shift-info.model";
import { MonthInfoLogic, VerboseDate } from "../../logic/schedule-logic/month-info.logic";
import { WorkerType } from "../../common-models/worker-info.model";
import { Color } from "../colors/color.model";
import { ColorHelper } from "../colors/color.helper";
import { TranslationHelper } from "../tranlsations.helper";
import {
  ChildrenSectionKey,
  MetaDataRowLabel,
  MetaDataSectionKey,
} from "../../logic/section.model";

const EMPTY_ROW = Array(100).fill("");

export class ExportFormatter {
  constructor(private scheduleModel: ScheduleDataModel) {}

  public formatAndSave(): void {
    const [workbook, workSheet] = this.createWorkArea();
    const headerRow = this.createHeader(this.scheduleModel);
    const datesSection = this.createDatesSection(this.scheduleModel);
    const childrenInfoSection = this.createChildrenInfoSection(this.scheduleModel);
    const [nurseShifts, babysitterShifts] = this.createShiftsSections(this.scheduleModel);
    const schedule = [
      headerRow,
      ...datesSection,
      EMPTY_ROW,
      ...childrenInfoSection,
      EMPTY_ROW,
      ...nurseShifts,
      EMPTY_ROW,
      ...babysitterShifts,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW,
      EMPTY_ROW,
    ];
    this.addStyles(workSheet, schedule);
    this.saveToFile(workbook);
  }

  private createWorkArea(): [xlsx.Workbook, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();
    return [workbook, workbook.addWorksheet("grafik", { properties: { defaultColWidth: 5 } })];
  }

  private addStyles(workSheet: xlsx.Worksheet, rows: unknown[]): void {
    const monthInfo = this.scheduleModel.schedule_info;
    const monthLogic = new MonthInfoLogic(
      monthInfo?.month_number || 0,
      monthInfo?.year + "" || "",
      this.scheduleModel.month_info?.dates || [],
      true
    );
    const verboseDates = monthLogic.verboseDates;
    workSheet.addRows(rows);
    workSheet.getColumn(1).width = 20;
    workSheet.eachRow((row) => {
      let isShiftRow = false;
      row.eachCell((cell, colNumber) => {
        const cellValue = cell.value?.toString() || "";
        if ((cellValue && ShiftCode[cellValue]) || isShiftRow) {
          isShiftRow = true;
          // colNumber - 1, because first column is key column
          cell.style = this.getShiftStyle(
            ShiftCode[cellValue] || ShiftCode.W,
            verboseDates[colNumber - 1]
          );
        }
      });
    });
  }

  private getShiftStyle(code: ShiftCode, verboseDate?: VerboseDate): Partial<xlsx.Style> {
    const shiftFillColor = ColorHelper.getShiftColor(code, verboseDate).backgroundColor;
    const borderColor: Partial<xlsx.Border> = {
      color: { argb: this.rgbaToArgbHex(new Color(218, 218, 218)) },
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
    const toHex = (num): string => ("0" + num.toString(16)).slice(-2);
    const c = color;
    return `${toHex(c.a)}${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  }

  private createShiftsSections(scheduleModel: ScheduleDataModel): string[][] {
    const grouped = {
      [WorkerType.NURSE]: [] as string[],
      [WorkerType.OTHER]: [] as string[],
    };
    Object.keys(scheduleModel.shifts || {}).forEach((key) => {
      const category = scheduleModel.employee_info?.type[key] ?? "";
      grouped[category].push([
        key,
        ...(scheduleModel?.shifts?.[key].map((s) => (s === ShiftCode.W ? " " : s)) || []),
      ]);
    });
    return [grouped[WorkerType.NURSE], grouped[WorkerType.OTHER]];
  }

  private createHeader(scheduleModel: ScheduleDataModel): string[] {
    const headerRow = { [MetaDataRowLabel]: "" };
    headerRow[MetaDataSectionKey.Month] = Object.keys(TranslationHelper.monthTranslations)[
      scheduleModel?.schedule_info?.month_number || 0
    ];
    headerRow[MetaDataSectionKey.Year] = scheduleModel?.schedule_info?.year || 0;
    // TODO implement work time calculation
    headerRow[MetaDataSectionKey.RequiredavailableWorkersWorkTime] = 0;
    return Object.keys(headerRow).map((key) => `${key} ${headerRow[key]}`);
  }

  private createChildrenInfoSection(
    scheduleModel: ScheduleDataModel
  ): (number | ChildrenSectionKey)[][] {
    // in case if it will be more complecated section
    return [
      [
        ChildrenSectionKey.RegisteredChildrenCount,
        ...(scheduleModel.month_info?.children_number || []),
      ],
    ];
  }

  private createDatesSection(scheduleModel: ScheduleDataModel): (number | MetaDataSectionKey)[][] {
    return [[MetaDataSectionKey.MonthDays, ...(scheduleModel?.month_info?.dates || [])]];
  }

  private saveToFile(workbook: xlsx.Workbook): void {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      fs.saveAs(blob, "grafik.xlsx");
    });
  }
}
