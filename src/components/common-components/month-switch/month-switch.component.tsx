/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { IconButton } from "@material-ui/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import React from "react";
import { useDispatch } from "react-redux";
import { useActualMonth } from "./use-actual-month";
import { MonthSwitchActionCreator } from "../../../state/reducers/month-state/schedule-data/month-switch.action-creator";

interface MonthSwitchOpions {
  key?: string;
}
export function MonthSwitchComponent(options: MonthSwitchOpions): JSX.Element {
  const arrowSize = "small";
  const actualMonth = useActualMonth();
  const dispatch = useDispatch();
  return (
    <>
      {actualMonth && (
        <div id="month-switch">
          <IconButton className="arrow-button" size={arrowSize}>
            <MdChevronLeft
              onClick={(): void => {
                dispatch(MonthSwitchActionCreator.switchToNewMonth(-1));
              }}
            />
          </IconButton>

          <span>{actualMonth}</span>

          <IconButton className="arrow-button" size={arrowSize}>
            <MdChevronRight
              onClick={(): void => {
                dispatch(MonthSwitchActionCreator.switchToNewMonth(1));
              }}
            />
          </IconButton>
        </div>
      )}
    </>
  );
}
