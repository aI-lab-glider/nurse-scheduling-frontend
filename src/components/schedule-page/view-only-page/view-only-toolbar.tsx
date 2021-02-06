/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from "react";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import { Link } from "react-router-dom";
import { Button } from "../../common-components";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

interface ViewOnlyToolbarOptions {
  openEdit: () => void;
}
export function ViewOnlyToolbar({ openEdit }: ViewOnlyToolbarOptions): JSX.Element {
  const [revisionType, setRevisionType] = React.useState<string>("actual");
  const [isScheduleMonthInFuture, setIsScheduleMonthInFuture] = React.useState<boolean>(false);
  const { year, month_number: month } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    if (currentYear > year || (currentYear === year && currentMonth >= month)) {
      setIsScheduleMonthInFuture(true);
    } else {
      setIsScheduleMonthInFuture(false);
    }
  }, [year, month]);

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    setRevisionType(event.target.value);
  };

  return (
    <div className="buttons">
      <div className="revision-type-container">
        {isScheduleMonthInFuture ? (
          <form>
            <select
              value={revisionType}
              onChange={handleChange}
              className="revision-select"
              data-cy="revision-select"
            >
              <option value="primary">wersja podstawowa</option>
              <option value="actual">wersja aktualna</option>
            </select>
          </form>
        ) : (
          <p>wersja podstawowa</p>
        )}
      </div>
      <div className="filler" />
      <ImportButtonsComponent />
      <Link to="/schedule-editing">
        <Button
          onClick={openEdit}
          size="small"
          className="submit-button"
          variant="primary"
          data-cy="edit-mode-button"
        >
          Edytuj
        </Button>
      </Link>
    </div>
  );
}
