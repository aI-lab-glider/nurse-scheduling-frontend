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
  length: number;
}

export default function ErrorList({ errors = [] }: Options): JSX.Element {
  const oth: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.OTH),
    length: errors.filter((e) => e.type === ScheduleErrorType.OTH).length,
  };
  const aon: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.AON),
    length: errors.filter((e) => e.type === ScheduleErrorType.AON).length,
  };
  const wnd: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.WND),
    length: errors.filter((e) => e.type === ScheduleErrorType.WND).length,
  };
  const wnn: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.WNN),
    length: errors.filter((e) => e.type === ScheduleErrorType.WNN).length,
  };
  const dss: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.DSS),
    length: errors.filter((e) => e.type === ScheduleErrorType.DSS).length,
  };
  const llb: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.LLB),
    length: errors.filter((e) => e.type === ScheduleErrorType.LLB).length,
  };
  const wuh: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.WUH),
    length: errors.filter((e) => e.type === ScheduleErrorType.WUH).length,
  };
  const woh: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.WOH),
    length: errors.filter((e) => e.type === ScheduleErrorType.WOH).length,
  };
  const isv: ErrorTypes = {
    errorType: ScheduleErrorType.AON,
    errors: errors.filter((e) => e.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE),
    length: errors.filter((e) => e.type === ScheduleErrorType.ILLEGAL_SHIFT_VALUE).length,
  };
  return (
    <>
      {aon.length > 0 && (
        <FoldingSection name={`Brak pielęgniarek (${aon.length})`}>
          <div className="scrollableContainer75vh">
            {aon.errors?.map(
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
      {wnd.length > 0 && (
        <FoldingSection name={`Za mało pracowników w trakcie dnia (${wnd.length})`}>
          <div className="scrollableContainer75vh">
            {wnd.errors?.map(
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
      {wnn.length > 0 && (
        <FoldingSection name={`Za mało pracowników w nocy (${wnn.length})`}>
          <div className="scrollableContainer75vh">
            {wnn.errors?.map(
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
      {dss.length > 0 && (
        <FoldingSection name={`Niedozwolona sekwencja zmian (${dss.length})`}>
          <div className="scrollableContainer75vh">
            {dss.errors?.map(
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
      {llb.length > 0 && (
        <FoldingSection name={`Brak wymaganej długiej przerwy (${llb.length})`}>
          <div className="scrollableContainer75vh">
            {llb.errors?.map(
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
      {wuh.length > 0 && (
        <FoldingSection name={`Niedogodziny (${wuh.length})`}>
          <div className="scrollableContainer75vh">
            {wuh.errors?.map(
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
      {woh.length > 0 && (
        <FoldingSection name={`Nadgodziny (${woh.length})`}>
          <div className="scrollableContainer75vh">
            {woh.errors?.map(
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
      {isv.length > 0 && (
        <FoldingSection name={`Niedozwolona wartość zmiany (${isv.length})`}>
          <div className="scrollableContainer75vh">
            {isv.errors?.map(
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
      {oth.length > 0 && (
        <FoldingSection name={`Pozostałe błędy (${oth.length})`}>
          <div className="scrollableContainer75vh">
            {oth.errors?.map(
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
