/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useDispatch, useSelector } from "react-redux";
import { ScheduleDataModel } from "../state/models/common-models/schedule-data.model";
import { ApplicationStateModel } from "../state/models/application-state.model";
import { ScheduleDataActionCreator } from "../state/schedule-state/schedule-data.action-creator";
import * as _ from "lodash";

export function useTemporarySchedule(): {
  temporarySchedule: ScheduleDataModel;
  saveToPersistent: () => void;
} {
  const dispatch = useDispatch();
  const temporarySchedule = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present
  );

  const saveToPersistent = (): void => {
    dispatch(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(temporarySchedule));
  };

  return {
    saveToPersistent,
    temporarySchedule: _.cloneDeep(temporarySchedule),
  };
}
