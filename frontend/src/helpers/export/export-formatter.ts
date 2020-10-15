import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import fs from "file-saver";
import xlsx from "exceljs";
import { ShiftCode } from "../../state/models/schedule-data/shift-info.model";
import { MonthLogic } from "../../logic/real-schedule-logic/month.logic";
import { WorkerType } from "../../state/models/schedule-data/employee-info.model";
import { Color } from "../colors/color.model";
import { ColorProvider } from "../colors/color.provider";

const EMPTY_ROW = Array(100).fill("");

export class ExportFormatter {
  private headerRow = {
    GRAFIK: "",
    MIESIĄC: "",
    ROK: 0,
  };

  constructor(private scheduleModel: ScheduleDataModel) {}

  public formatAndSave() {
    const [workbook, workSheet] = this.createWorkArea();
    this.addConditionalFormatting(workSheet);
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
    this.saveToFile(workbook, workSheet, schedule);
  }

  private createWorkArea(): [xlsx.Workbook, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();
    return [workbook, workbook.addWorksheet("grafik", { properties: { defaultColWidth: 5 } })];
  }

  private addConditionalFormatting(worksheet: xlsx.Worksheet) {
    const cellRules = Object.values(ShiftCode).map((code) =>
      this.createShiftConditionalFormattingRule(code)
    );
    worksheet.addConditionalFormatting({
      ref: "A1:AZ1000",
      rules: [...cellRules],
    });
  }

  private createShiftConditionalFormattingRule(code: ShiftCode): xlsx.ConditionalFormattingRule {
    const shiftFillColor = ColorProvider.getShiftColor(code).backgroundColor;
    return {
      type: "cellIs",
      operator: "equal",
      formulae: [`UPPER("${code}")`],
      priority: 0,
      style: {
        alignment: {
          horizontal: "center",
          vertical: "middle",
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: this.rgbaToArgbHex(shiftFillColor) },
        },
      },
    };
  }

  private rgbaToArgbHex(color: Color): string {
    const toHex = (num) => ("0" + num.toString(16)).slice(-2);
    const c = color;
    return `${toHex(c.a)}${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  }

  private createShiftsSections(scheduleModel: ScheduleDataModel) {
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

  private createHeader(scheduleModel: ScheduleDataModel) {
    this.headerRow.MIESIĄC = Object.keys(MonthLogic.monthTranslations)[
      scheduleModel?.schedule_info?.month_number || 0
    ];
    this.headerRow.ROK = scheduleModel?.schedule_info?.year || 0;
    return Object.keys(this.headerRow).map((key) => `${key} ${this.headerRow[key]}`);
  }

  private createChildrenInfoSection(scheduleModel: ScheduleDataModel) {
    // in case if it will be more complecated section
    return [
      ["Liczba dzieci zarejestrowanych", ...(scheduleModel.month_info?.children_number || [])],
    ];
  }

  private createDatesSection(scheduleModel: ScheduleDataModel) {
    return [["Dni miesiąca", ...(scheduleModel?.month_info?.dates || [])]];
  }

  private saveToFile(workbook: xlsx.Workbook, workSheet: xlsx.Worksheet, rows: any[]) {
    workSheet.addRows(rows);
    workSheet.getColumn(1).width = 20;
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      fs.saveAs(blob, "grafik.xlsx");
    });
  }
}
