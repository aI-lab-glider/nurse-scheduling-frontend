import React from "react";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { FoldingSection } from "../../common-components";
import ErrorListItem from "./error-list-item.component";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { useSelector } from "react-redux";

interface Options {
  errors?: ScheduleErrorMessageModel[];
}

export default function ErrorList({ errors = [] }: Options): JSX.Element {
  /* eslint-disable @typescript-eslint/camelcase */
  const { month_number, year } = useSelector(
    (state: ApplicationStateModel) => state.scheduleData.present.schedule_info
  );

  let actualMonthGenetivus = "";
  if (month_number && year) {
    actualMonthGenetivus = `${TranslationHelper.polishMonthsGenetivus[month_number]}`;
  }

  return (
    <FoldingSection name="Errors">
      <div className="scrollableContainer75vh">
        {errors?.length > 0 &&
        errors.map(
          (error, index): JSX.Element => (
            <ErrorListItem
              key={error.message.substr(2, 9) + index}
              error={error}
              month={actualMonthGenetivus}
            />
          )
        )}
        {errors?.length === 0 && "Nie znaleziono błędów"}      </div>
    </FoldingSection>
  );
}
