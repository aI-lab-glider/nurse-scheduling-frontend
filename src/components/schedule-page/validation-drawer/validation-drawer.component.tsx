/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Drawer from "../../common-components/drawer/drawer.component";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorLoader from "./error-loader.component";
import { NetworkErrorCode } from "../../../common-models/schedule-error.model";

export interface ValidationDrawerOptions {
  open: boolean;
  setOpen: (boolean) => void;
}

export enum ErrorLoaderState {
  CHECKING = "CHECKING",
  NOERRORS = "NOERRORS",
  ERRORS = "ERRORS",
  CONNECTIONFAILED = "CONNECTIONFAILED",
}

export interface ValidationDrawerState {
  state: ErrorLoaderState;
  message: string;
}

export type Props = ValidationDrawerState;

export default function ValidationDrawerComponent(options: ValidationDrawerOptions): JSX.Element {
  const { open, setOpen } = options;
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const [loadingState, setLoadingState] = useState<Props>();
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state.actualState);

  useEffect(() => {
    const spinner = {
      state: ErrorLoaderState.CHECKING,
      message: "Spinner",
    };
    const errorsFound = {
      state: ErrorLoaderState.ERRORS,
      message: "Errors found",
    };
    const noErrors = {
      state: ErrorLoaderState.NOERRORS,
      message: "No errors found",
    };
    if (
      scheduleErrors?.includes({ kind: NetworkErrorCode.NETWORK_ERROR, message: "Błąd połączenia" })
    ) {
      setIsNetworkError(true);
    }
    if (scheduleErrors) {
      if (scheduleErrors.length > 0) {
        setMappedErrors(scheduleErrors);
        setLoadingState(errorsFound);
      } else {
        setLoadingState(noErrors);
      }
    } else {
      setLoadingState(spinner);
    }
  }, [scheduleErrors]);

  function closeDrawer(): void {
    setOpen(false);
  }

  return (
    <Drawer
      title="Sprawdź plan"
      setOpen={setOpen}
      open={open}
      onClose={(): void => closeDrawer()}
      anchor="right"
    >
      <ErrorLoader state={loadingState} errors={mappedErrors} isNetworkError={isNetworkError} />
    </Drawer>
  );
}
