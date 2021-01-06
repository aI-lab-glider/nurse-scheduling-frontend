/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useDispatch } from "react-redux";
import { ScheduleDataActionCreator } from "../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { Button } from "../common-components";
import { useActualMonth } from "../common-components/month-switch/use-actual-month";

export function NewMonthPlanComponent(): JSX.Element {
  const actualMonth = useActualMonth();
  const dispatch = useDispatch();
  return (
    <>
      <div className={"newMonthComponents"}>
        <img
          src="https://filestore.community.support.microsoft.com/api/images/72e3f188-79a1-465f-90ca-27262d769841"
          alt=""
        />
        <p>Nie masz planu na ten miesiąc</p>
        <div className={"newPageButtonsPane"}>
          <Button
            onClick={(): void => {
              dispatch(ScheduleDataActionCreator.copyPreviousMonth());
            }}
            size="small"
            className="submit-button"
            variant="outlined"
          >
            Kopiuj plan z {actualMonth}
          </Button>
          <Button size="small" className="submit-button" variant="primary">
            Wgraj plan z pliku
          </Button>
        </div>
      </div>
    </>
  );
}
