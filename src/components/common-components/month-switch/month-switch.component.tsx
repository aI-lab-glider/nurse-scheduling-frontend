import { IconButton } from "@material-ui/core";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { TranslationHelper } from "../../../helpers/tranlsations.helper";
import { StringHelper } from "../../../helpers/string.helper";

interface MonthSwitchOpions {
  key?: string;
}
export function MonthSwitchComponent(options: MonthSwitchOpions): JSX.Element {
  const arrowSize = "small";
  /* eslint-disable @typescript-eslint/camelcase */
  const { month_number, year } = useSelector(
    (state: ApplicationStateModel) => state.scheduleData.present.schedule_info
  );

  let actualMonth = "";
  if (month_number && year) {
    actualMonth = StringHelper.capitalize(
      `${TranslationHelper.polishMonths[month_number]} ${year}`
    );
  }
  return (
    <>
      {actualMonth && (
        <div id="month-switch">
          <IconButton className="arrow-button" size={arrowSize}>
            <IoIosArrowBack />
          </IconButton>
          <span>{actualMonth}</span>
          <IconButton className="arrow-button" size={arrowSize}>
            <IoIosArrowForward />
          </IconButton>
        </div>
      )}
    </>
  );
}
