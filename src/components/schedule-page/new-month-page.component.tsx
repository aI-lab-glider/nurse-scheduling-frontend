/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { ChangeEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TranslationHelper } from "../../helpers/translations.helper";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { createMonthKey } from "../../state/reducers/history.reducer";
import { getDateWithMonthOffset } from "../../state/reducers/month-state/schedule-data/common-reducers";
import { ScheduleDataActionCreator } from "../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { Button } from "../common-components";
import { useScheduleConverter } from "./import-buttons/hooks/use-schedule-converter";

export function NewMonthPlanComponent(): JSX.Element {
  const state = useSelector((state: ApplicationStateModel) => state);
  const currentMonth = state.actualState.persistentSchedule.present.schedule_info.month_number ?? 0;
  const currentYear = state.actualState.persistentSchedule.present.schedule_info.year ?? 0;
  const nextDate = getDateWithMonthOffset(currentMonth, currentYear, 1);
  const prevDate = getDateWithMonthOffset(currentMonth, currentYear, -1);
  const nextMonth = state.history[createMonthKey(nextDate.getMonth(), nextDate.getFullYear())];
  const prevMonth = state.history[createMonthKey(prevDate.getMonth(), prevDate.getFullYear())];
  const { scheduleModel, setSrcFile, scheduleErrors, errorOccurred } = useScheduleConverter();

  const hasNext =
    nextMonth !== undefined && nextMonth.persistentSchedule.present.month_info.dates.length > 0;
  const hasPrevious =
    prevMonth !== undefined && prevMonth.persistentSchedule.present.month_info.dates.length > 0;
  const dispatch = useDispatch();

  const fileUpload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scheduleModel) {
      const action = ScheduleDataActionCreator.setSchedule(scheduleModel);
      dispatch(action);
    }
  });
  function handleImport(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  }

  return (
    <>
      <div className={"newMonthComponents"}>
        <img
          src="https://filestore.community.support.microsoft.com/api/images/72e3f188-79a1-465f-90ca-27262d769841"
          alt=""
        />
        <p>Nie masz planu na ten miesiąc</p>
        <div className={"newPageButtonsPane"}>
          {hasPrevious && (
            <Button
              onClick={(): void => {
                dispatch(ScheduleDataActionCreator.copyPreviousMonth());
              }}
              size="small"
              className="submit-button"
              variant="outlined"
            >
              {" "}
              {`Kopiuj plan z ${
                TranslationHelper.polishMonths[prevDate.getMonth()]
              } ${prevDate.getFullYear()}`}
            </Button>
          )}

          {hasNext && !hasPrevious && (
            <Button
              onClick={(): void => {
                dispatch(ScheduleDataActionCreator.copyNextMonth());
              }}
              size="small"
              className="submit-button"
              variant="outlined"
            >
              {`Kopiuj plan z ${
                TranslationHelper.polishMonths[nextDate.getMonth()]
              } ${nextDate.getFullYear()}`}
            </Button>
          )}

          <Button
            size="small"
            className="submit-button"
            variant="primary"
            onClick={(): void => fileUpload.current?.click()}
          >
            <input
              ref={fileUpload}
              id="file-input"
              data-cy="file-input"
              onChange={(event): void => handleImport(event)}
              style={{ display: "none" }}
              type="file"
              accept=".xlsx"
            />
            Wgraj z pliku
          </Button>
        </div>
      </div>
    </>
  );
}
