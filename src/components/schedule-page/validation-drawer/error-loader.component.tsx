import { Button } from "../../common-components";
import React, { useState } from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorList from "./error-list.component";
import { ErrorLoaderState, Props } from "./validation-drawer.component";
import { SpanErrors } from "./span-errors.component";
import warning from "../../../assets/images/warning.svg";
import ok from "../../../assets/images/ok.svg";
import useForceUpdate from "./use-force-update";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
  isNetworkError?: boolean;
  setOpen: (boolean) => void;
}

export default function ErrorLoaderComponent(options: ErrorLoaderOptions): JSX.Element {
  const { setOpen, isNetworkError } = options;
  const [spinnerAgain, setSpinnerAgain] = useState(false);
  const forceUpdate = useForceUpdate();

  function closeDrawer(): void {
    setOpen(false);
  }

  const reload = React.useCallback(() => {
    setSpinnerAgain(true);
    forceUpdate();
    setTimeout(() => setSpinnerAgain(false), 1000);
  }, [forceUpdate]);

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
