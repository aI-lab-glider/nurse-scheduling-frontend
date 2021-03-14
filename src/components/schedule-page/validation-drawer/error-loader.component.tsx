/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Button } from "../../common-components";
import React, { useContext, useState } from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorList from "./error-list.component";
import { ErrorLoaderState, Props } from "./validation-drawer.component";
import { SpanErrors } from "./span-errors.component";
import warning from "../../../assets/images/warning.svg";
import ok from "../../../assets/images/ok.svg";
import { NetworkErrorCode, ScheduleError } from "../../../common-models/schedule-error.model";
import backend from "../../../api/backend";
import { ScheduleErrorActionType } from "../../../state/reducers/month-state/schedule-errors.reducer";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleLogicContext } from "../table/schedule/use-schedule-state";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
  isNetworkError?: boolean;
  setOpen: (boolean) => void;
}

export default function ErrorLoaderComponent(options: ErrorLoaderOptions): JSX.Element {
  const { setOpen, isNetworkError } = options;
  const [spinnerAgain, setSpinnerAgain] = useState(false);
  const scheduleLogic = useContext(ScheduleLogicContext);
  const shifts = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );
  const dispatcher = useDispatch();

  function closeDrawer(): void {
    setOpen(false);
  }

  const reload = React.useCallback(() => {
    async function updateScheduleErrors(): Promise<void> {
      const schedule = scheduleLogic?.schedule.getDataModel();
      if (schedule) {
        let response: ScheduleError[];
        try {
          response = await backend.getErrors(schedule, shifts);
        } catch (err) {
          response = [
            {
              kind: NetworkErrorCode.NETWORK_ERROR,
            },
          ];
        }
        dispatcher({
          type: ScheduleErrorActionType.UPDATE,
          payload: response,
        } as ActionModel<ScheduleError[]>);
      }
    }
    setSpinnerAgain(true);
    updateScheduleErrors();
    setTimeout(() => setSpinnerAgain(false), 4000);
  }, [dispatcher, scheduleLogic, shifts]);

  return (
    <>
      {(options.state?.state === ErrorLoaderState.CHECKING || spinnerAgain) && (
        <div className="error-loading-container">
          <div className="center">
            <div className="spinner" />
            <div className="error-loading-text">Trwa sprawdzanie planu</div>
          </div>
        </div>
      )}
      {isNetworkError && !spinnerAgain && (
        <div className="error-loading-container">
          <div className="center">
            <img src={warning} alt="" />
            <div className="error-loading-text">Błąd podczas sprawdzania</div>
            <Button variant="primary" onClick={reload}>
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      )}
      {options.state?.state === ErrorLoaderState.ERRORS && !isNetworkError && (
        <>
          <SpanErrors errors={options.errors} />
          <ErrorList errors={options.errors} />
        </>
      )}
      {options.state?.state === ErrorLoaderState.NOERRORS && (
        <div className="error-loading-container">
          <div className="center">
            <img src={ok} alt="" />
            <div className="error-loading-text">Plan nie zawiera błędów</div>
            <Button variant="primary" onClick={closeDrawer}>
              Wróć do planu
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
