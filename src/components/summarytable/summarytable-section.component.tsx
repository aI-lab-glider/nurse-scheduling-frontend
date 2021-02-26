/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WorkerType } from "../../common-models/worker-info.model";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { DataRow } from "../../logic/schedule-logic/data-row";
import {
  ApplicationStateModel,
  ScheduleStateModel,
} from "../../state/models/application-state.model";
import { ScheduleErrorActionCreator } from "../../state/schedule-error.action-creator";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { SummaryTableRow } from "./summarytable-row.component";

export interface SummaryTableSectionOptions {
  dataRows: DataRow[];
  workerType: WorkerType;
}

export function SummaryTableSection({
  dataRows,
  workerType,
}: SummaryTableSectionOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const isEditMode = useSelector(
    (state: ApplicationStateModel) => state.actualState.mode === "edit"
  );
  const scheduleKey: keyof ScheduleStateModel = isEditMode
    ? "temporarySchedule"
    : "persistentSchedule";
  const { time } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.employee_info
  );
  const { shifts = {} } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present
  );
  const { month_number: currentMonth, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.schedule_info
  );
  const { dates } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.month_info
  );

  const dispatch = useDispatch();

  function calculateSummaryTableInfo(workerName: string): number[] {
    const hoursInfo = ShiftHelper.caclulateWorkHoursInfoForDates(
      shifts[workerName],
      time[workerName],
      currentMonth,
      year,
      dates
    );
    const [, , overtime] = hoursInfo;
    if (overtime !== 0) {
      const updateWorkerTimeInfo = ScheduleErrorActionCreator.addUndertimeOrOvertimeError(
        overtime,
        workerName
      );
      dispatch(updateWorkerTimeInfo);
    }
    return hoursInfo;
  }

  return (
    <>
      <table
        className="table"
        id="summaryTable"
        data-cy={`${workerType.toLowerCase()}SummaryTable`}
      >
        <tbody>
          {dataRows.map((dataRow, rowIndex) => {
            return (
              <SummaryTableRow
                key={`${scheduleLogic?.uuid ?? 0}_${dataRow.rowKey}`}
                uuid={scheduleLogic?.uuid ?? "0"}
                data={calculateSummaryTableInfo(dataRow.rowKey)}
                rowIndex={rowIndex}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
