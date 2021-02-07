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
  return (
    <div className="buttons">
      <div className="filler" />
      <ImportButtonsComponent />
      <Link to="/schedule-editing">
        <Button onClick={openEdit} variant="primary" data-cy="edit-mode-button">
          Edytuj
        </Button>
      </Link>
    </div>
  );
}
