import { Button } from "../../common-components";
import React from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorList from "./error-list.component";
import { ErrorLoaderState, Props } from "./validation-drawer.component";
import { SpanErrors } from "./span-errors.component";
import warning from "../../../assets/images/warning.svg";
import ok from "../../../assets/images/ok.svg";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
  isNetworkError?: boolean;
}

export default function ErrorLoaderComponent(options: ErrorLoaderOptions): JSX.Element {
  return (
    <>
      {options.state?.state === ErrorLoaderState.CHECKING && (
        <div className="error-loading-container">
          <div className="center">
            <div>SPINNER??</div>
            <div className="error-loading-text">Trwa sprawdzanie planu</div>
          </div>
        </div>
      )}
      {options.isNetworkError && (
        <div className="error-loading-container">
          <div className="center">
            <img src={warning} alt="" />
            <div className="error-loading-text">Błąd podczas sprawdzania</div>
            <Button variant="primary">Spróbuj ponownie</Button>
          </div>
        </div>
      )}
      {options.state?.state === ErrorLoaderState.ERRORS && (
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
            <Button variant="primary">Wróć do planu</Button>
          </div>
        </div>
      )}
    </>
  );
}
