/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useDispatch } from "react-redux";
import { VerboseDate } from "../../../common-models/month-info.model";
import {
  ScheduleErrorMessageModel,
  ScheduleErrorType,
} from "../../../common-models/schedule-error-message.model";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { ScheduleDataActionCreator } from "../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { Button } from "../../common-components";
import { useWorkerGroups } from "../table/schedule/use-worker-groups";
import { useMonthInfo } from "./use-verbose-dates";

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
  const groupedWorkers = useWorkerGroups();
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

  if (error.type === ScheduleErrorType.WTC) {
    for (let i = 0; error.workers && i < error.workers?.length; i++) {
      Object.entries(groupedWorkers).forEach(([groupName, workers]) => {
        const workerNames = [""];
        workers.forEach((workerInfo) => workerNames.push(workerInfo.workerName));

        if (workerNames.includes(error.workers![i])) {
          error.message = error.message
            ?.split(`${error.workers![i]}`)
            .join(`${error.workers![i]} (${groupName})`);
        }
      });
    }
  }
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
            Pokaż
          </Button>
        </div>
      )}
    </div>
  );
}
