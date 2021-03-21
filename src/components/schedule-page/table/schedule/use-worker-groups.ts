/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import _ from "lodash";
import { useSelector } from "react-redux";
import { ShiftInfoModel } from "../../../../common-models/shift-info.model";
import { WorkersInfoModel } from "../../../../common-models/worker-info.model";
import {
  ApplicationStateModel,
  ScheduleStateModel,
} from "../../../../state/models/application-state.model";
import { WorkerInfo } from "../../../namestable/use-worker-info";
import { ScheduleMode } from "./schedule-state.model";

interface GroupedWorkers {
  [groupName: string]: WorkerInfo[];
}

const aggregateWorkerInfo = (
  workerName: string,
  workerShifts: ShiftInfoModel,
  workerInfo: WorkersInfoModel
): WorkerInfo =>
  new WorkerInfo(
    workerName,
    workerInfo.contractType?.[workerName],
    workerInfo.time[workerName],
    workerInfo.type[workerName],
    workerShifts[workerName],
    workerInfo.workerGroup[workerName]
  );

export function useWorkerGroups(): GroupedWorkers {
  const { mode } = useSelector((state: ApplicationStateModel) => state.actualState);
  const targetSchedule: keyof ScheduleStateModel =
    mode === ScheduleMode.Edit ? "temporarySchedule" : "persistentSchedule";

  const workerInfo = useSelector(
    (state: ApplicationStateModel) => state.actualState[targetSchedule].present.employee_info
  );
  const workerShifts = useSelector(
    (state: ApplicationStateModel) => state.actualState[targetSchedule].present.shifts
  );

  const aggregatedData = Object.keys(workerShifts).map((workerName) =>
    aggregateWorkerInfo(workerName, workerShifts, workerInfo)
  );
  return _.groupBy(aggregatedData, (item) => item.workerGroup);
}
