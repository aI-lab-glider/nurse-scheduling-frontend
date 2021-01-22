/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorLoader from "./error-loader.component";
import { NetworkErrorCode } from "../../../common-models/schedule-error.model";
import { ErrorMessageHelper } from "../../../helpers/error-message.helper";

export interface ValidationDrawerContentOptions {
  setOpen: (boolean) => void;
}

export enum ErrorLoaderState {
  CHECKING = "CHECKING",
  NOERRORS = "NOERRORS",
  ERRORS = "ERRORS",
}

export interface ValidationDrawerContentState {
  state: ErrorLoaderState;
}

export type Props = ValidationDrawerContentState;

export default function ValidationDrawerContentComponent(
  options: ValidationDrawerContentOptions
): JSX.Element {
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const [loadingState, setLoadingState] = useState<Props>();
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state.actualState);
  const { setOpen } = options;

  useEffect(() => {
    const spinner = {
      state: ErrorLoaderState.CHECKING,
    };
    const errorsFound = {
      state: ErrorLoaderState.ERRORS,
    };
    const noErrors = {
      state: ErrorLoaderState.NOERRORS,
    };
    if (scheduleErrors[NetworkErrorCode.NETWORK_ERROR]) {
      setIsNetworkError(true);
    } else {
      setIsNetworkError(false);
    }
    if (scheduleErrors) {
      const errors = ErrorMessageHelper.mapScheduleErrors(scheduleErrors);
      if (errors.length > 0) {
        setMappedErrors(errors);
        setLoadingState(errorsFound);
      } else {
        setLoadingState(spinner);
      }
    } else {
      setLoadingState(noErrors);
    }
  }, [scheduleErrors]);

  return (
    <ErrorLoader
      state={loadingState}
      errors={mappedErrors}
      isNetworkError={isNetworkError}
      setOpen={setOpen}
    />
  );
}
