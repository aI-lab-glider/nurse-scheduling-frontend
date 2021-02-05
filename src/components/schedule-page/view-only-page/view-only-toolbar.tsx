/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ImportButtonsComponent } from "../import-buttons/import-buttons.component";
import { Link } from "react-router-dom";
import { Button } from "../../common-components";

interface ViewOnlyToolbarOptions {
  openEdit: () => void;
}
export function ViewOnlyToolbar({ openEdit }: ViewOnlyToolbarOptions): JSX.Element {
  const [revisionType, setRevisionType] = React.useState<string>("actual");

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    setRevisionType(event.target.value);
  };

  return (
    <div className="buttons">
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
