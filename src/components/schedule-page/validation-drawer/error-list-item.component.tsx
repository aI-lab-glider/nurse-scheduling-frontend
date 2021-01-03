import React, { useContext } from "react";
import { Button } from "../../common-components";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { ScheduleLogicContext } from "../table/schedule/use-schedule-state";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { useSelector } from "react-redux";

interface Options {
  error: ScheduleErrorMessageModel;
}

export default function ErrorListItem({ error }: Options): JSX.Element {
  /* eslint-disable @typescript-eslint/camelcase */
  const { month_number } = useSelector(
    (state: ApplicationStateModel) => state.temporarySchedule.present.schedule_info
  );

  let currMonthGenetivus = "";
  let prevMonthGenetivus = "";
  if (month_number) {
    currMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[month_number]}`;
    if (month_number > 0) {
      prevMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[month_number - 1]}`;
    } else {
      prevMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[month_number + 11]}`;
    }
  }

  const scheduleLogic = useContext(ScheduleLogicContext);
  const mappedDays = scheduleLogic?.sections.Metadata?.verboseDates.map((d) => d.date);

  const monthStartIndex = scheduleLogic?.sections.Metadata?.dates.findIndex((d) => d === 1) ?? 0;

  let errorDayIndex = -1;
  let errorDay = -1;
  if (error.day && mappedDays) {
    errorDayIndex = error.day - 1;
    errorDay = mappedDays[errorDayIndex];
  }

  const month = errorDayIndex < monthStartIndex ? prevMonthGenetivus : currMonthGenetivus;

  return (
    <div className="error-list-item">
      <div className="red-rectangle" />
      <div className="error-title">
        <p className="error-title-content">
          {error.title === "date" ? `${errorDay} ` + month : `${error.title}`}
        </p>
      </div>
      <div className="error-text">{error.message}</div>
      <div className="error-btn">
        <Button variant="primary" id="error-buttons" style={{ width: "90px", height: "26px" }}>
          Pokaż
        </Button>
      </div>
    </div>
  );
}
