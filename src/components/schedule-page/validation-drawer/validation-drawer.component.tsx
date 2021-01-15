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
}

export interface ValidationDrawerState {
  state: ErrorLoaderState;
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
    };
    const errorsFound = {
      state: ErrorLoaderState.ERRORS,
    };
    const noErrors = {
      state: ErrorLoaderState.NOERRORS,
    };
    if (scheduleErrors?.find((element) => element.kind === NetworkErrorCode.NETWORK_ERROR)) {
      setIsNetworkError(true);
    } else {
      setIsNetworkError(false);
    }
    if (scheduleErrors) {
      if (scheduleErrors.length > 0) {
        setMappedErrors(scheduleErrors);
        setLoadingState(errorsFound);
      } else {
        setLoadingState(spinner);
      }
    } else {
      setLoadingState(noErrors);
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
      <ErrorLoader
        state={loadingState}
        errors={mappedErrors}
        isNetworkError={isNetworkError}
        setOpen={setOpen}
      />
    </Drawer>
  );
}
