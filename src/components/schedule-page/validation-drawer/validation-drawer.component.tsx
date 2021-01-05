import Drawer from "../../common-components/drawer/drawer.component";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorLoader from "./error-loader.component";

export interface ValidationDrawerOptions {
  open: boolean;
  setOpen: (boolean) => void;
}

export enum errorLoaderState {
  CHECKING = "CHECKING",
  NOERRORS = "NOERRORS",
  ERRORS = "ERRORS",
  CONNECTIONFAILED = "CONNECTIONFAILED",
}

export interface CheckingStateProps {
  state: errorLoaderState.CHECKING;
  message: string;
}

export interface ErrorsStateProps {
  state: errorLoaderState.ERRORS;
  message: string;
}

export interface NoErrorsStateProps {
  state: errorLoaderState.NOERRORS;
  message: string;
}

export interface ConnectionFailedStateProps {
  state: errorLoaderState.CONNECTIONFAILED;
  message: string;
}

export type Props =
  | CheckingStateProps
  | ErrorsStateProps
  | NoErrorsStateProps
  | ConnectionFailedStateProps;

export default function ValidationDrawerComponent(options: ValidationDrawerOptions): JSX.Element {
  const { open, setOpen } = options;
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const [loadingState, setLoadingState] = useState<Props>();
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state.actualState);

  useEffect(() => {
    const spinner: CheckingStateProps = {
      state: errorLoaderState.CHECKING,
      message: "Spinner",
    };
    const failed: ConnectionFailedStateProps = {
      state: errorLoaderState.CONNECTIONFAILED,
      message: "Connection failed",
    };
    const errorsFound: ErrorsStateProps = {
      state: errorLoaderState.ERRORS,
      message: "Errors found",
    };
    const noErrors: NoErrorsStateProps = {
      state: errorLoaderState.NOERRORS,
      message: "No errors found",
    };
    if (scheduleErrors) {
      if (scheduleErrors.length > 0) {
        setMappedErrors(scheduleErrors);
        setLoadingState(errorsFound);
      } else {
        setLoadingState(noErrors);
      }
    } else {
      setLoadingState(spinner);
      setLoadingState(failed);
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
      <ErrorLoader state={loadingState} errors={mappedErrors} />
    </Drawer>
  );
}
