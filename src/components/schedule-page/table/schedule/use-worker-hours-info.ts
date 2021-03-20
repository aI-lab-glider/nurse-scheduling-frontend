/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShiftCode } from "../../../../common-models/shift-info.model";
import { isAllValuesDefined } from "../../../../common-models/type-utils";
import { MonthDataArray } from "../../../../helpers/shifts.helper";
import { WorkerHourInfo } from "../../../../helpers/worker-hours-info.model";
import {
  ApplicationStateModel,
  ScheduleStateModel,
} from "../../../../state/models/application-state.model";
import { ScheduleMode } from "./schedule-state.model";

export function useWorkerHoursInfo(workerName: string): WorkerHourInfo {
  const isEditMode = useSelector(
    (state: ApplicationStateModel) => state.actualState.mode === ScheduleMode.Edit
  );
  const scheduleKey: keyof ScheduleStateModel = isEditMode
    ? "temporarySchedule"
    : "persistentSchedule";

  const workerTime = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.employee_info.time
  )[workerName];
  const workerShifts = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.shifts
  )[workerName];

  const primaryWorkerShifts = useSelector(
    (state: ApplicationStateModel) => state.actualState.primaryRevision.shifts
  )[workerName];

  const { month: primaryRevisionMonth } = useSelector(
    (state: ApplicationStateModel) => state.actualState.primaryRevision.scheduleKey
  );
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.schedule_info
  );
  const { dates } = useSelector(
    (state: ApplicationStateModel) => state.actualState[scheduleKey].present.month_info
  );

  const [workHoursInfo, setWorkHoursInfo] = useState(new WorkerHourInfo(0, 0));

  useEffect(() => {
    if (primaryRevisionMonth === month) {
      if (!isAllValuesDefined([workerTime, workerShifts])) {
        return setWorkHoursInfo(new WorkerHourInfo(0, 0));
      }

      setWorkHoursInfo(
        WorkerHourInfo.fromWorkerInfo(
          workerShifts,
          primaryWorkerShifts as MonthDataArray<ShiftCode>, // TODO: modify MonthDataModel to contain only MonthDataArray
          workerTime,
          month,
          year,
          dates
        )
      );
    }
  }, [workerShifts, primaryWorkerShifts, workerTime, month, year, dates, primaryRevisionMonth]);

  return workHoursInfo;
}
