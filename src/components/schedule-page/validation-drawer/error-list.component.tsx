/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import {
  ScheduleErrorMessageModel,
  ScheduleErrorType,
} from "../../../common-models/schedule-error-message.model";
import { FoldingSection } from "../../common-components";
import ErrorListItem from "./error-list-item.component";

interface Options {
  errors?: ScheduleErrorMessageModel[];
}

interface ErrorTypes {
  errorType: ScheduleErrorType;
  errors?: ScheduleErrorMessageModel[];
  errorDescription: string;
}

export default function ErrorList({ errors = [] }: Options): JSX.Element {
  const errorObjects: Array<ErrorTypes> = [
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.AON),
      errorDescription: "Brak pielęgniarek",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.WND),
      errorDescription: "Za mało pracowników w trakcie dnia",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.WNN),
      errorDescription: "Za mało pracowników w nocy",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.DSS),
      errorDescription: "Naruszenie wymaganej przerwy",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.LLB),
      errorDescription: "Brak wymaganej długiej przerwy",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.WUH),
      errorDescription: "Niedogodziny",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.WOH),
      errorDescription: "Nadgodziny",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE),
      errorDescription: "Niedozwolona wartość zmiany",
    },
    {
      errorType: ScheduleErrorType.AON,
      errors: errors.filter((e) => e.type === ScheduleErrorType.OTH),
      errorDescription: "Pozostałe błędy",
    },
  ];

  function compareErrors(a: ScheduleErrorMessageModel, b: ScheduleErrorMessageModel): number {
    if (typeof a.day !== "undefined" && typeof b.day !== "undefined") {
      return a.day - b.day;
    }
    return 0;
  }

  const renderOneTypeOfErrors = (errorData: ErrorTypes): JSX.Element => {
    return errorData.errors && errorData.errors.length > 0 ? (
      <FoldingSection name={`${errorData.errorDescription} (${errorData.errors.length})`}>
        {errorData.errors.sort(compareErrors).map(
          (error, index): JSX.Element => (
            <ErrorListItem key={`${error.kind ? error.kind : "0"}_${index}`} error={error} />
          )
        )}
      </FoldingSection>
    ) : (
      <></>
    );
  };

  return (
    <>
      {errorObjects.map((errorObject) => (
        <React.Fragment key={errorObject.errorDescription + errorObject.errors?.length}>
          {renderOneTypeOfErrors(errorObject)}
        </React.Fragment>
      ))}
    </>
  );
}
