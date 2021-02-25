/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { VerboseDate } from "../../../common-models/month-info.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { Button } from "../../common-components";
import { useMonthInfo } from "./use-verbose-dates";

interface Options {
  error: ScheduleErrorMessageModel;
  interactable?: boolean;
  className?: string;
  showTitle?: boolean;
}

export default function ErrorListItem({
  error,
  interactable = true,
  className = "",
  showTitle = true,
}: Options): JSX.Element {
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

  let errorDayIndex = -1;
  let errorDay = -1;
  if (error.day && mappedDays) {
    errorDayIndex = error.day - 1;
    errorDay = mappedDays[errorDayIndex];
  }

  const monthName = errorDayIndex < monthStartIndex ? prevMonthGenetivus : currMonthGenetivus;

  return (
    <div className={`error-list-item ${className}`}>
      <div className="red-rectangle" />
      {showTitle && (
        <div className="error-title">
          <p className="error-title-content">
            {error.title === "date" ? `${errorDay} ` + monthName : `${error.title}`}
          </p>
        </div>
      )}
      <div className="error-text" dangerouslySetInnerHTML={{ __html: error.message || "" }} />
      {interactable && (
        <div className="error-btn">
          <Button variant="primary" id="error-buttons" style={{ width: "90px", height: "26px" }}>
            Pokaż
          </Button>
        </div>
      )}
    </div>
  );
}
