/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useDispatch, useSelector } from "react-redux";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataActionCreator } from "../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";

export function useTemporarySchedule(): {
  temporarySchedule: ScheduleDataModel;
  setAsPersistent: () => void;
} {
  const dispatch = useDispatch();
  const temporarySchedule = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present
  );
  const setAsPersistent = (): void => {
    dispatch(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(temporarySchedule));
  };
  return {
    setAsPersistent,
    temporarySchedule,
  };
}
