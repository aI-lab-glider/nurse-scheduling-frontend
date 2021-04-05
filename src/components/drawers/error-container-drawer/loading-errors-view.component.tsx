/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import backend from "../../../api/backend";
import ok from "../../../assets/images/ok.svg";
import warning from "../../../assets/images/warning.svg";
import { ScheduleErrorMessageModel } from "../../../state/models/common-models/schedule-error-message.model";
import {
  NetworkErrorCode,
  ScheduleError,
} from "../../../state/models/common-models/schedule-error.model";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorActionType } from "../../../state/reducers/month-state/schedule-errors.reducer";
import { Button } from "../../common-components";
import ErrorList from "../../error-list/error-list.component";
import { SpanErrors } from "../../error-list/span-errors.component";
import { ErrorLoaderState, Props } from "./error-container-drawer.component";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
  isNetworkError?: boolean;
  setOpen: (boolean) => void;
}

export default function LoadingErrorsViewComponent(options: ErrorLoaderOptions): JSX.Element {
  const { setOpen, isNetworkError } = options;
  const [spinnerAgain, setSpinnerAgain] = useState(false);
  const { primaryRevision } = useSelector((app: ApplicationStateModel) => app.actualState);

  const dispatcher = useDispatch();

  function closeDrawer(): void {
    setOpen(false);
  }

  const schedule = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present
  );
  const reload = React.useCallback(() => {
    async function updateScheduleErrors(): Promise<void> {
      if (schedule) {
        let response: ScheduleError[];
        try {
          response = await backend.getErrors(schedule, primaryRevision);
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
  }, [dispatcher, primaryRevision, schedule]);

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
