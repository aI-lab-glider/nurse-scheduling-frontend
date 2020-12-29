import { IconButton } from "@material-ui/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import React from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { TranslationHelper } from "../../../helpers/tranlsations.helper";
import { StringHelper } from "../../../helpers/string.helper";
import { Link } from "react-router-dom";

interface MonthSwitchOpions {
  actualMonth?: string;
  key?: string;
}
export function MonthSwitchComponent(options: MonthSwitchOpions): JSX.Element {
  const arrowSize = "small";
  return (
    <>
      {options.actualMonth && (
        <div id="month-switch">
          <IconButton className="arrow-button" size={arrowSize}>
            <MdChevronLeft />
          </IconButton>

          <span>{options.actualMonth}</span>

          <Link to="/next-month">
            <IconButton className="arrow-button" size={arrowSize}>
              <MdChevronRight />
            </IconButton>
          </Link>
        </div>
      )}
    </>
  );
}
