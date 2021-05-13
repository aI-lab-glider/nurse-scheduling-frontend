/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";
import { ScheduleDataModel } from "../../state/schedule-data/schedule-data.model";
import { EMPTY_ROW, ABSENCE_HEADERS } from "../../helpers/parser.helper";
import { CELL_MARGIN } from "./schedule-export.logic";
import { ShiftCode, SHIFTS } from "../../state/schedule-data/shifts-types/shift-types.model";
import { TranslationHelper } from "../../helpers/translations.helper";
import {
  DateInformationForWorkInfoCalculation,
  WorkerHourInfo,
} from "../schedule-logic/worker-hours-info.logic";
import { PrimaryMonthRevisionDataModel } from "../../state/application-state.model";
import { MonthInfoLogic } from "../schedule-logic/month-info.logic";
import { WeekDay } from "../../state/schedule-data/foundation-info/foundation-info.model";

export class WorkersAbsenceExportLogic {
  private scheduleModel: ScheduleDataModel;

  private revision: PrimaryMonthRevisionDataModel;

  private cellsToMerge: number[][];

  constructor(scheduleModel: ScheduleDataModel, revision: PrimaryMonthRevisionDataModel) {
    this.scheduleModel = scheduleModel;
    this.revision = revision;
    this.cellsToMerge = [];
  }

  public setWorkersWorkSheet(workSheet: xlsx.Worksheet): void {
    workSheet.pageSetup.showGridLines = true;
    workSheet.pageSetup.fitToPage = true;
    workSheet.pageSetup.fitToHeight = 1;
    workSheet.pageSetup.fitToWidth = 1;
    workSheet.pageSetup.horizontalCentered = true;

    const workersInfoArray = this.createWorkersInfoSection(this.scheduleModel, this.revision);

    const colLens = workersInfoArray[0].map((_, colIndex) =>
      Math.max(...workersInfoArray.map((row) => row[colIndex]?.toString().length ?? 0))
    );

    workSheet.addRows(workersInfoArray);

    this.cellsToMerge.forEach((pair, index) => {
      if (this.cellsToMerge[index][0] > 0) {
        const top = pair[0];
        let bottom = pair[1];
        let i = index;

        while (this.cellsToMerge[i + 1] !== undefined && this.cellsToMerge[i + 1][0] === bottom) {
          this.cellsToMerge[i + 1][0] = -1;
          bottom = this.cellsToMerge[i + 1][1];
          i++;
        }

        workSheet.mergeCells(top, 1, bottom, 1);
        workSheet.mergeCells(top, 6, bottom, 6);
        workSheet.mergeCells(top, 7, bottom, 7);
      }
    });

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

  private createWorkersInfoSection(
    scheduleModel: ScheduleDataModel,
    revision: PrimaryMonthRevisionDataModel
  ): (string | number)[][] {
    const names = Object.keys(scheduleModel.employee_info?.type);
    const month = scheduleModel.schedule_info.month_number;
    const year = scheduleModel.schedule_info.year;
    const dates = scheduleModel.month_info.dates;
    const workers: (string | number)[][] = [];

    const shiftTypes = scheduleModel.shift_types;

    let employeeRowIndex = 2;

    workers.push(ABSENCE_HEADERS);
    workers.push(EMPTY_ROW);
    names.forEach((name) => {
      const workerShifts = scheduleModel.shifts[name] as ShiftCode[];
      const workerContractType = scheduleModel.employee_info.contractType[name];
      const { verboseDates } = new MonthInfoLogic(month, year, dates);

      let moreThanOneRow = false;
      workerShifts.forEach((shift, index) => {
        let daysNo = 0;
        if (
          !(
            verboseDates[index].isPublicHoliday ||
            verboseDates[index].dayOfWeek === WeekDay.SA ||
            verboseDates[index].dayOfWeek === WeekDay.SU
          )
        )
          daysNo++;
        if (shift !== ShiftCode.W && shift !== ShiftCode.NZ && !SHIFTS[shift].isWorkingShift) {
          employeeRowIndex++;
          const from = scheduleModel.month_info.dates[index];
          while (
            index + 1 < workerShifts.length &&
            workerShifts[index + 1] === workerShifts[index]
          ) {
            workerShifts[index] = ShiftCode.W;
            index++;
            if (
              !(
                verboseDates[index].isPublicHoliday ||
                verboseDates[index].dayOfWeek === WeekDay.SA ||
                verboseDates[index].dayOfWeek === WeekDay.SU
              )
            )
              daysNo++;
          }
          workerShifts[index] = ShiftCode.W;
          if (!moreThanOneRow) {
            workers.push([
              name,
              SHIFTS[shift].name,
              `${from} ${TranslationHelper.polishMonthsGenetivus[month]}`,
              `${scheduleModel.month_info.dates[index]} ${TranslationHelper.polishMonthsGenetivus[month]}`,
              daysNo,
              WorkerHourInfo.calculateFreeHoursForContractType(
                workerContractType,
                scheduleModel.shifts[name] as ShiftCode[],
                revision.shifts[name],
                verboseDates as DateInformationForWorkInfoCalculation[],
                shiftTypes
              ),
            ]);
            moreThanOneRow = true;
          } else {
            const toMerge: number[] = [];
            workers.push([
              "",
              SHIFTS[shift].name,
              `${from} ${TranslationHelper.polishMonthsGenetivus[month]}`,
              `${scheduleModel.month_info.dates[index]} ${TranslationHelper.polishMonthsGenetivus[month]}`,
              daysNo,
            ]);
            toMerge.push(employeeRowIndex - 1);
            toMerge.push(employeeRowIndex);
            this.cellsToMerge.push(toMerge);
          }
        }
      });
    });
    return [...workers];
  }
}
