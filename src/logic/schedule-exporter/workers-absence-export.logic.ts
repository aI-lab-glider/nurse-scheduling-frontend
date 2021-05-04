/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";
import { MonthDataModel } from "../../state/schedule-data/schedule-data.model";
import { PrimaryMonthRevisionDataModel } from "../../state/application-state.model";
import { EMPTY_ROW, ABSENCE_HEADERS } from "../../helpers/parser.helper";
import { CELL_MARGIN } from "./schedule-export.logic";
// import { ShiftCode, SHIFTS } from "../../state/schedule-data/shifts-types/shift-types.model";

export interface WorkersAbsenceExportLogicOptions {
  scheduleModel: MonthDataModel;
  primaryScheduleModel?: PrimaryMonthRevisionDataModel;
}

/*
interface WorkersAbsenceData {
  name: string;
  shift: string;
  from: string;
  to: string;
  daysNo: string;
  hoursNp: string;
}
*/

export class WorkersAbsenceExportLogic {
  private scheduleModel: MonthDataModel;

  constructor({ scheduleModel }: WorkersAbsenceExportLogicOptions) {
    this.scheduleModel = scheduleModel;
  }

  public setWorkersWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const workersInfoArray = WorkersAbsenceExportLogic.createWorkersInfoSection(this.scheduleModel);

    const colLens = workersInfoArray[0].map((_, colIndex) =>
      Math.max(...workersInfoArray.map((row) => row[colIndex]?.toString().length ?? 0))
    );

    workSheet.addRows(workersInfoArray);

    colLens.forEach((len, id) => {
      workSheet.getColumn(id + 1).width = len + CELL_MARGIN;
    });

    workSheet.getColumn(1).alignment = { vertical: "middle", horizontal: "left" };
    for (let i = 1; i <= ABSENCE_HEADERS.length; i++) {
      workSheet.getColumn(i).alignment = { vertical: "middle", horizontal: "center" };
    }

    workSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    workSheet.getRow(1).font = { bold: true };
  }

  private static createWorkersInfoSection(scheduleModel: MonthDataModel): (string | number)[][] {
    const names = Object.keys(scheduleModel.employee_info?.type);
    // const workerShifts = names.map((name) => [name, Object.keys(scheduleModel.shifts[name] as ShiftCode[])]);

    const workers: (string | number)[][] = [];

    workers.push(ABSENCE_HEADERS);
    workers.push(EMPTY_ROW);
    names.forEach((name) =>
      workers.push([
        name,
        // Object.keys(scheduleModel.shifts[name] as ShiftCode[]).join(),
        // typ
        // od
        // do
        // ile dni
        // ile godzin
      ])
    );
    return [...workers];
  }
}
