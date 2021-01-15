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

export default function ErrorList({ errors = [] }: Options): JSX.Element {
  return (
    <>
      {errors?.filter((e) => e.type === ScheduleErrorType.UNDERTIME).length > 0 &&
        errors?.find((element) => element.type === ScheduleErrorType.UNDERTIME) && (
          <FoldingSection
            name={
              "Niedogodziny (" +
              `${errors?.filter((e) => e.type === ScheduleErrorType.UNDERTIME).length}` +
              ")"
            }
          >
            <div className="scrollableContainer75vh">
              {errors
                .filter((e) => e.type === ScheduleErrorType.UNDERTIME)
                .map(
                  (error, index): JSX.Element => (
                    <ErrorListItem
                      key={(error.message ? error.message.substr(2, 9) : "0") + index}
                      error={error}
                    />
                  )
                )}
            </div>
          </FoldingSection>
        )}
      {errors?.length > 0 &&
        errors?.find((element) => element.type === ScheduleErrorType.OVERTIME) && (
          <FoldingSection
            name={
              "Nadgodziny (" +
              `${errors?.filter((e) => e.type === ScheduleErrorType.OVERTIME).length}` +
              ")"
            }
          >
            <div className="scrollableContainer75vh">
              {errors
                .filter((e) => e.type === ScheduleErrorType.OVERTIME)
                .map(
                  (error, index): JSX.Element => (
                    <ErrorListItem
                      key={(error.message ? error.message.substr(2, 9) : "0") + index}
                      error={error}
                    />
                  )
                )}
            </div>
          </FoldingSection>
        )}
      {errors?.length > 0 &&
        errors?.find((element) => element.type === ScheduleErrorType.NOT_ENOUGH_WORKERS) && (
          <FoldingSection
            name={
              "Niewystarczająca liczba pracowników (" +
              `${errors?.filter((e) => e.type === ScheduleErrorType.NOT_ENOUGH_WORKERS).length}` +
              ")"
            }
          >
            <div className="scrollableContainer75vh">
              {errors
                .filter((e) => e.type === ScheduleErrorType.NOT_ENOUGH_WORKERS)
                .map(
                  (error, index): JSX.Element => (
                    <ErrorListItem
                      key={(error.message ? error.message.substr(2, 9) : "0") + index}
                      error={error}
                    />
                  )
                )}
            </div>
          </FoldingSection>
        )}
      {errors?.length > 0 &&
        errors?.find((element) => element.type === ScheduleErrorType.ILLEGAL_SEQUENCE) && (
          <FoldingSection
            name={
              "Niedozwolona sekwencja zmian (" +
              `${errors?.filter((e) => e.type === ScheduleErrorType.ILLEGAL_SEQUENCE).length}` +
              ")"
            }
          >
            <div className="scrollableContainer75vh">
              {errors
                .filter((e) => e.type === ScheduleErrorType.ILLEGAL_SEQUENCE)
                .map(
                  (error, index): JSX.Element => (
                    <ErrorListItem
                      key={(error.message ? error.message.substr(2, 9) : "0") + index}
                      error={error}
                    />
                  )
                )}
            </div>
          </FoldingSection>
        )}
      {errors?.length > 0 &&
        errors?.find((element) => element.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE) && (
          <FoldingSection
            name={
              "Niedozwolona wartość zmiany" +
              `${errors?.filter((e) => e.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE).length}` +
              ")"
            }
          >
            <div className="scrollableContainer75vh">
              {errors
                .filter((e) => e.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE)
                .map(
                  (error, index): JSX.Element => (
                    <ErrorListItem
                      key={(error.message ? error.message.substr(2, 9) : "0") + index}
                      error={error}
                    />
                  )
                )}
            </div>
          </FoldingSection>
        )}
      {errors?.length > 0 && errors?.find((element) => element.type === ScheduleErrorType.OTHER) && (
        <FoldingSection
          name={
            "Pozostałe błędy" +
            `${errors?.filter((e) => e.type === ScheduleErrorType.UNDERTIME).length}` +
            ")"
          }
        >
          <div className="scrollableContainer75vh">
            {errors
              .filter((e) => e.type === ScheduleErrorType.OTHER)
              .map(
                (error, index): JSX.Element => (
                  <ErrorListItem
                    key={(error.message ? error.message.substr(2, 9) : "0") + index}
                    error={error}
                  />
                )
              )}
          </div>
        </FoldingSection>
      )}
    </>
  );
}
