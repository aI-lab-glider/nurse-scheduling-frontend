/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";
import { ScheduleDataModel } from "../../state/schedule-data/schedule-data.model";
import { EMPTY_ROW, ABSENCE_HEADERS } from "../../helpers/parser.helper";
import { CELL_MARGIN } from "./schedule-export.logic";
import { ShiftCode, SHIFTS } from "../../state/schedule-data/shifts-types/shift-types.model";
import { TranslationHelper } from "../../helpers/translations.helper";
import { WorkerHourInfo } from "../schedule-logic/worker-hours-info.logic";
import { MonthDataArray } from "../../helpers/shifts.helper";
import { PrimaryMonthRevisionDataModel } from "../../state/application-state.model";

export class WorkersAbsenceExportLogic {
  private scheduleModel: ScheduleDataModel;

  private revision: PrimaryMonthRevisionDataModel;

  constructor(scheduleModel: ScheduleDataModel, revision: PrimaryMonthRevisionDataModel) {
    this.scheduleModel = scheduleModel;
    this.revision = revision;
  }

  public setWorkersWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const workersInfoArray = WorkersAbsenceExportLogic.createWorkersInfoSection(
      this.scheduleModel,
      this.revision
    );

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

  private static createWorkersInfoSection(
    scheduleModel: ScheduleDataModel,
    revision: PrimaryMonthRevisionDataModel
  ): (string | number)[][] {
    const names = Object.keys(scheduleModel.employee_info?.type);
    const month = scheduleModel.schedule_info.month_number;
    const year = scheduleModel.schedule_info.year;
    const workers: (string | number)[][] = [];

    const time = scheduleModel.employee_info.time;

    workers.push(ABSENCE_HEADERS);
    workers.push(EMPTY_ROW);
    names.forEach((name) => {
      const workerShifts = scheduleModel.shifts[name] as ShiftCode[];

      const workerHours = WorkerHourInfo.fromWorkerInfo(
        workerShifts,
        revision.shifts[name] as MonthDataArray<ShiftCode>,
        time[name],
        scheduleModel.employee_info.contractType[name],
        month,
        year,
        scheduleModel.month_info.dates,
        scheduleModel.shift_types
      );

      workerShifts.forEach((shift, index) => {
        let daysNo = 1;
        if (shift !== ShiftCode.W && !SHIFTS[shift].isWorkingShift) {
          const from = scheduleModel.month_info.dates[index];
          while (
            index + 1 < workerShifts.length &&
            workerShifts[index + 1] === workerShifts[index]
          ) {
            index++;
            daysNo++;
            workerShifts[index - 1] = ShiftCode.W;
          }
          workerShifts[index] = ShiftCode.W;
          workers.push([
            name,
            SHIFTS[shift].name,
            `${from} ${TranslationHelper.polishMonthsGenetivus[month]}`,
            `${scheduleModel.month_info.dates[index]} ${TranslationHelper.polishMonthsGenetivus[month]}`,
            daysNo,
            Math.round(
              (daysNo * workerHours.workerHourNorm) / scheduleModel.month_info.dates.length
            ),
            year,
          ]);
        }
      });
    });
    return [...workers];
  }
}
