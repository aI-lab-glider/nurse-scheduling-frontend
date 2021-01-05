import { Button } from "../../common-components";
import React from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorList from "./error-list.component";
import { errorLoaderState, Props } from "./validation-drawer.component";
import { SpanErrors } from "./span-errors.component";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
}

export default function ErrorLoaderComponent(options: ErrorLoaderOptions): JSX.Element {
  return (
    <>
      <div>{options.state?.message}</div>
      {options.state?.state === errorLoaderState.CHECKING && (
        <div className="error-loading-container">
          <div className="center">
            <div>SPINNER??</div>
            <div className="error-loading-text">Trwa sprawdzanie planu</div>
          </div>
        </div>
      )}
      {options.state?.state === errorLoaderState.CONNECTIONFAILED && (
        <div className="error-loading-container">
          <div className="center">
            <img
              alt=""
              src="https://firebasestorage.googleapis.com/v0/b/tara-cloud.appspot.com/o/orgs%2Fnurse-scheduling%2Ftasks%2F169%2Fwarning-sign-487a6f66-ab0b-419c-801d-a4d690d1b0da.svg?alt=media&token=ab809143-93d0-4313-9fbf-85778efc23e4"
            ></img>
            <div className="error-loading-text">Błąd podczas sprawdzania</div>
            <Button variant="primary">Spróbuj ponownie</Button>
          </div>
        </div>
      )}
      {options.state?.state === errorLoaderState.ERRORS && (
        <>
          <SpanErrors errors={options.errors} />
          <ErrorList errors={options.errors} />
        </>
      )}
      {options.state?.state === errorLoaderState.NOERRORS && (
        <div className="error-loading-container">
          <div className="center">
            <div className="no-errors">
              <div className="no-errors-v" />
            </div>
            <div className="error-loading-text">Plan nie zawiera błędów</div>
            <Button variant="primary">Wróć do planu</Button>
          </div>
        </div>
      )}
    </>
  );
}
