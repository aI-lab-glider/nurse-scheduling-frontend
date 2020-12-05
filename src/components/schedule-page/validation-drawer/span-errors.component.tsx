import React from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { Button } from "../../common-components";

interface SpanErrorOptions {
  errors?: ScheduleErrorMessageModel[];
}

export function SpanErrors({ errors = [] }: SpanErrorOptions): JSX.Element {
  return (
    <>
      <div className={"span-errors"}>
        <h3 className={"error-span-header"}>Sprawdź plan</h3>
        <hr />
        <div className={"error-span-main-block"}>
          <div className={"error-numbers"}>
            <p>Błędy : {errors?.length}</p>
          </div>
          <div className={"error-buttons-row"}>
            <Button id={"error-buttons"} variant="outlined">
              Ukryj błędy
            </Button>
            <Button id={"error-buttons"} variant="primary">
              Pokaż błędy
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
