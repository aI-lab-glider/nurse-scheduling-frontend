/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { IconButton } from "@material-ui/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import React from "react";
import { Link } from "react-router-dom";
import { useActualMonth } from "./use-actual-month";

interface MonthSwitchOpions {
  key?: string;
}
export function MonthSwitchComponent(options: MonthSwitchOpions): JSX.Element {
  const arrowSize = "small";
  const actualMonth = useActualMonth();

  return (
    <>
      {actualMonth && (
        <div id="month-switch">
          <IconButton className="arrow-button" size={arrowSize}>
            <MdChevronLeft />
          </IconButton>

          <span>{actualMonth}</span>

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
