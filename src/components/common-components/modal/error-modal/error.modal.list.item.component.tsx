/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { VerboseDate } from "../../../../common-models/month-info.model";
import { ScheduleErrorMessageModel } from "../../../../common-models/schedule-error-message.model";
import { TranslationHelper } from "../../../../helpers/translations.helper";
import { useMonthInfo } from "../../../schedule-page/validation-drawer/use-verbose-dates";

interface Options {
  error: ScheduleErrorMessageModel;
}

export default function ModalErrorListItem({ error }: Options): JSX.Element {
  const { verboseDates, monthNumber } = useMonthInfo();
  const mappedDays = verboseDates.map((d: VerboseDate) => d.date);
  const monthStartIndex = verboseDates.findIndex((d: VerboseDate) => d.date === 1) ?? 0;

  let currMonthGenetivus = "";
  let prevMonthGenetivus = "";
  if (monthNumber) {
    currMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[monthNumber]}`;
    if (monthNumber > 0) {
      prevMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[monthNumber - 1]}`;
    } else {
      prevMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[monthNumber + 11]}`;
    }
  }

  const errorDayIndex = error.day ? error.day : -1;
  const errorDay = errorDayIndex ? mappedDays[errorDayIndex] : "";
  const monthName = errorDayIndex
    ? errorDayIndex < monthStartIndex
      ? prevMonthGenetivus
      : currMonthGenetivus
    : "";

  const displayTitle = error.title && error.title !== "Nie rozpoznano błędu";
  return (
    <div className="error-list-item">
      <div className="red-rectangle" />
      <div className="error-modal">
        {displayTitle && (
          <div className="error-title">
            <p className="error-title-content">
              {error.title}
              {errorDayIndex > -1 ? `, ${errorDay} ` + monthName : ``}
            </p>
          </div>
        )}
        <div
          className="error-text-modal"
          dangerouslySetInnerHTML={{ __html: error.message || "" }}
        />
      </div>
    </div>
  );
}
