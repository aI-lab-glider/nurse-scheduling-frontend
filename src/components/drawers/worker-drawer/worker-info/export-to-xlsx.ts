/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";

import _ from "lodash";
import { FileHelper } from "../../../../helpers/file.helper";
import { ScheduleExportLogic } from "../../../../logic/schedule-exporter/schedule-export.logic";
import { EMPTY_ROW } from "../../../../helpers/parser.helper";
import { VerboseDate } from "../../../../state/schedule-data/foundation-info/foundation-info.model";
import { ShiftCode, SHIFTS } from "../../../../state/schedule-data/shifts-types/shift-types.model";
import { ShiftHelper } from "../../../../helpers/shifts.helper";
import { ColorHelper } from "../../../../helpers/colors/color.helper";

const TOP_OFFSET = 1;
const LEFT_OFFSET = 1;
const NAME_ROW_WIDTH = 7;
const NAME_ROW_HEIGHT = 2;
const INFO_SEC_ROW_LEN = 3;
const WEEKDAY_HEIGHT = 2;

const HEIGTH = 36;
const WIDTH = 16;

export const exportToXlsx = (name: string, info, schedule: { string: string }): void => {
  const xlsx = new WorkerCalendarXlsxExport({ name, info, schedule });
  xlsx.formatAndSave();
};

export const WORKSHEET_NAME = "grafik";

export class WorkerCalendarXlsxExport {
  private readonly name: string;

  private readonly info: { string: string };

  private readonly schedule: { string: string };

  constructor({ name, info, schedule }) {
    this.name = name;
    this.info = info;
    this.schedule = schedule;
  }

  public formatAndSave(): void {
    const [finalName, workbook] = this.createWorkbook();
    FileHelper.saveToFile(workbook, finalName);
  }

  private static createWorkArea(): [xlsx.Workbook, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();

    return [
      workbook,
      workbook.addWorksheet(WORKSHEET_NAME, {
        pageSetup: {
          orientation: "portrait",
          showGridLines: true,
          printArea: "B2:H24",
          fitToPage: true,
          margins: {
            left: 0.7,
            right: 0.7,
            top: 0.75,
            bottom: 0.75,
            header: 0.3,
            footer: 0.3,
          },
          horizontalCentered: true,
          verticalCentered: true,
        },

        properties: { defaultColWidth: 10 },
      }),
    ];
  }

  public createWorkbook(): [string, xlsx.Workbook] {
    const [workbook, scheduleWorkSheet] = WorkerCalendarXlsxExport.createWorkArea();

    this.setScheduleWorkSheet(scheduleWorkSheet);

    const workbookName = WorkerCalendarXlsxExport.createFilename(this.name);
    return [workbookName, workbook];
  }

  private static createFilename(name: string): string {
    return `${name}.xlsx`;
  }

  private static createInfoSection(info: { string: number | string }): string[][] {
    const infoSection: string[][] = [];

    Object.keys(info).forEach((key) => {
      const infoRow = [key];
      for (let i = 0; i < INFO_SEC_ROW_LEN; i++) {
        infoRow.push(" ");
      }

      infoRow.push(info[key]);
      infoSection.push(infoRow);
    });
    return infoSection;
  }

  private static createCalendarSection(schedule): string[][] {
    const calendar: string[][] = [];
    let calendarDates: string[] = [];
    let calendarShifts: string[] = [];

    Object.keys(schedule).forEach((key) => {
      // eslint-disable-next-line radix
      const keyNum = parseInt(key);
      const shift = schedule[key];
      calendarDates.push((keyNum + 1).toString());

      if (shift === "W") {
        calendarShifts.push(" ");
      } else {
        calendarShifts.push(shift);
      }

      if ((keyNum + 1) % 7 === 0 || keyNum + 1 === schedule.length) {
        calendar.push(calendarDates);
        calendar.push(calendarShifts);
        calendarDates = [];
        calendarShifts = [];
      }
    });
    return calendar;
  }

  public setScheduleWorkSheet(workSheet: xlsx.Worksheet): void {
    ScheduleExportLogic.setupWorksheet(workSheet);

    const headerRow = WorkerCalendarXlsxExport.createHeader(this.name);
    const infoSection = WorkerCalendarXlsxExport.createInfoSection(this.info);
    const calendar = WorkerCalendarXlsxExport.createCalendarSection(this.schedule);

    const schedule: string[][] = [];

    schedule.push(EMPTY_ROW);
    schedule.push(headerRow);

    for (let i = 0; i < NAME_ROW_HEIGHT - 1; i++) {
      schedule.push(EMPTY_ROW);
    }

    schedule.push(EMPTY_ROW);
    schedule.push(...infoSection);
    schedule.push(EMPTY_ROW);
    schedule.push([" ", " ", "Zmiany"]);
    schedule.push(["PN", "WT", "SR", "CZ", "PT", "SB", "ND"]);

    for (let i = 0; i < WEEKDAY_HEIGHT - 1; i++) {
      schedule.push(EMPTY_ROW);
    }

    schedule.push(...calendar);

    workSheet.addRows(schedule);
    for (let i = 0; i < LEFT_OFFSET; i++) {
      workSheet.spliceColumns(1, 0, []);
    }

    WorkerCalendarXlsxExport.styleWorksheet(workSheet);
  }

  private static getShiftStyle(code: ShiftCode, verboseDate?: VerboseDate): Partial<xlsx.Style> {
    const shiftFillColor = ShiftHelper.getShiftColorForWorkersCalendar(
      code,
      _.cloneDeep(SHIFTS),
      verboseDate
    ).backgroundColor;

    return {
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: ScheduleExportLogic.rgbaToArgbHex(shiftFillColor) },
      },
      border: {
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },

      font: {
        color: {
          argb: ScheduleExportLogic.decideBlackOrWhite(
            ShiftHelper.getShiftColorForWorkersCalendar(code, _.cloneDeep(SHIFTS), verboseDate)
              .backgroundColor
          ),
        },
      },
    };
  }

  private static getCellStyle(code: ShiftCode, verboseDate?: VerboseDate): Partial<xlsx.Style> {
    const borderColor: Partial<xlsx.Border> = {
      color: { argb: ScheduleExportLogic.rgbaToArgbHex(ColorHelper.getBorderColor()) },
      style: "thin",
    };
    return {
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },

      border: {
        top: borderColor,
        bottom: borderColor,
        left: borderColor,
        right: borderColor,
      },
      font: {
        color: {
          argb: ScheduleExportLogic.decideBlackOrWhite(
            ShiftHelper.getShiftColor(code, _.cloneDeep(SHIFTS), verboseDate).backgroundColor
          ),
        },
      },
    };
  }

  private static styleWorksheet(workSheet): void {
    workSheet.getCell("A1").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    workSheet.mergeCells(
      TOP_OFFSET + 1,
      LEFT_OFFSET + 1,
      TOP_OFFSET + NAME_ROW_HEIGHT,
      LEFT_OFFSET + NAME_ROW_WIDTH
    );

    for (let i = 0; i < 4; i++) {
      workSheet.mergeCells(
        TOP_OFFSET + NAME_ROW_HEIGHT + 2 + i,
        LEFT_OFFSET + 1,
        TOP_OFFSET + NAME_ROW_HEIGHT + 2 + i,
        LEFT_OFFSET + INFO_SEC_ROW_LEN
      );
    }

    workSheet.mergeCells(
      TOP_OFFSET + NAME_ROW_HEIGHT + 2,
      LEFT_OFFSET + INFO_SEC_ROW_LEN + 2,
      TOP_OFFSET + NAME_ROW_HEIGHT + 2,
      LEFT_OFFSET + INFO_SEC_ROW_LEN + 4
    );

    workSheet.mergeCells(
      TOP_OFFSET + NAME_ROW_HEIGHT + 7,
      LEFT_OFFSET + 3,
      TOP_OFFSET + NAME_ROW_HEIGHT + 7,
      LEFT_OFFSET + 5
    );

    for (let i = 0; i < 7; i++) {
      workSheet.mergeCells(
        TOP_OFFSET + NAME_ROW_HEIGHT + 8,
        LEFT_OFFSET + 1 + i,
        TOP_OFFSET + NAME_ROW_HEIGHT + 9,
        LEFT_OFFSET + 1 + i
      );
    }

    const regexNum = /[0-9]+/;
    workSheet.eachRow((row, index) => {
      row.height = HEIGTH;

      row.eachCell((cell, colNumber) => {
        workSheet.getColumn(colNumber).width = WIDTH;
        const cellValue = cell.value?.toString() || "";
        cell.style = WorkerCalendarXlsxExport.getCellStyle(ShiftCode[cellValue] || ShiftCode.W);
      });

      if (index > 12) {
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          workSheet.getColumn(colNumber).width = WIDTH;
          const cellValue = cell.value?.toString() || "";

          cell.style = WorkerCalendarXlsxExport.getShiftStyle(ShiftCode[cellValue] || ShiftCode.W);

          if (cellValue.match(regexNum)) {
            row.height = HEIGTH * (2 / 3);
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = {
              horizontal: "right",
              vertical: "middle",
            };
          }
        });
      }
    });
  }

  private static createHeader(name: string): string[] {
    return [name];
  }
}
