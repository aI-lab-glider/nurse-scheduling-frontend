import React from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import ErrorListItem from "./error-list-item.component";

interface Options {
  errors?: ScheduleErrorMessageModel[];
}

export default function ErrorList({ errors = [] }: Options): JSX.Element {
  return (
    <div>
      {errors?.length > 0 &&
        errors.map(
          (error, index): JSX.Element => (
            <ErrorListItem key={error.toString().substr(2, 9) + index} error={error} />
          )
        )}
      {errors?.length === 0 && "Nie znaleziono błędów"}
    </div>
  );
}
