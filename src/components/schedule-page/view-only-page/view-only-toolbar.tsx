/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from "react";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import { Link } from "react-router-dom";
import { Button } from "../../common-components";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { RevisionReducerActionCreator } from "../../../state/reducers/month-state/revision-info.reducer";
import { RevisionType } from "../../../api/persistance-store.model";

interface ViewOnlyToolbarOptions {
  openEdit: () => void;
}
export function ViewOnlyToolbar({ openEdit }: ViewOnlyToolbarOptions): JSX.Element {
  const [isRevisionEditDisabled, setIsRevisionEditDisable] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const { year, month_number: month } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.schedule_info
  );

  const { revision } = useSelector((state: ApplicationStateModel) => state.actualState);

  useEffect(() => {
    if (revision === "actual") {
      setIsRevisionEditDisable(false);
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const isFuture = year > currentYear || (year === currentYear && month > currentMonth);
      setIsRevisionEditDisable(!isFuture);
    }
  }, [year, month, revision]);

  function isRevisionType(value: string): value is RevisionType {
    return value === "primary" || value === "actual";
  }

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: string }>): void => {
    const currentRev = event.target.value;
    if (isRevisionType(currentRev)) {
      dispatch(RevisionReducerActionCreator.changeRevision(currentRev));
    }
  };

  return (
    <div className="buttons">
      <div className="revision-type-container">
        <form>
          <select
            value={revision}
            onChange={handleChange}
            className="revision-select"
            data-cy="revision-select"
          >
            <option value="primary">wersja bazowa</option>
            <option value="actual">wersja aktualna</option>
          </select>
        </form>
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
          disabled={isRevisionEditDisabled}
        >
          Edytuj
        </Button>
      </Link>
    </div>
  );
}
