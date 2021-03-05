/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useSelector } from "react-redux";
import { WorkerHourInfo } from "../../../../helpers/worker-hours-info.model";
import {
  ApplicationStateModel,
  ScheduleStateModel,
} from "../../../../state/models/application-state.model";

export function useWorkerHoursInfo(workerName?: string): WorkerHourInfo {
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
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.schedule_info
  );
  const { dates } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.month_info
  );
  const { shifts: baseShifts } = useSelector(
    (state: ApplicationStateModel) => state.actualState.baseRevision
  );

  if (!workerName) {
    return new WorkerHourInfo(0, 0);
  }

  return WorkerHourInfo.fromWorkerInfo({
    shifts: shifts[workerName],
    baseWorkerShifts: baseShifts[workerName],
    workerNorm: time[workerName],
    month,
    year,
    dates,
  });
}
