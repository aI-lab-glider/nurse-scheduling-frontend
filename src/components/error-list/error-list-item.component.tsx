/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useDispatch } from "react-redux";
import { t, TranslationHelper } from "../../helpers/translations.helper";
import { useMonthInfo } from "../../hooks/use-month-info";
import { VerboseDate } from "../../state/schedule-data/foundation-info/foundation-info.model";
import { ScheduleDataActionCreator } from "../../state/schedule-data/schedule-data.action-creator";
import { ScheduleErrorMessageModel } from "../../state/schedule-data/schedule-errors/schedule-error-message.model";
import { Button } from "../common-components";

interface Options {
  error: ScheduleErrorMessageModel;
  index: number;
  interactable?: boolean;
  className?: string;
  showTitle?: boolean;
}

function prepareMonthName(index: number, day: number, month: number): string {
  let monthName = `${TranslationHelper.polishMonthsGenetivus[month]}`;

  if (index < day - 1) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 11) % 12]}`;
  } else if (index > 20 && day < 8) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 1) % 12]}`;
  }
  return monthName;
}

export default function ErrorListItem({
  error,
  interactable = false,
  index,
  className = "",
  showTitle = true,
}: Options): JSX.Element {
  const { verboseDates, monthNumber } = useMonthInfo();
  const mappedDays = verboseDates.map((d: VerboseDate) => d.date);

  if (typeof error.day === "undefined" || typeof mappedDays === "undefined") {
    throw Error(`Error undefined or mappedDays undefined`);
  }
  error.index = index;
  const errorDayIndex = error.day;
  const errorDay = mappedDays[errorDayIndex];
  const monthName = prepareMonthName(errorDayIndex, errorDay, monthNumber);
  const dispatch = useDispatch();

  const handleShow = (e: ScheduleErrorMessageModel): void => {
    dispatch(ScheduleDataActionCreator.showError(e));
  };
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
          <Button
            className="submit-button"
            variant="primary"
            id="error-buttons"
            style={{ width: "90px", height: "26px" }}
            onClick={(): void => handleShow(error)}
          >
            {t("show")}
          </Button>
        </div>
      )}
    </div>
  );
}