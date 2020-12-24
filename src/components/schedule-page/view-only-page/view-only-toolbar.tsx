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
        <Button onClick={openEdit} size="small" className="submit-button" variant="primary">
          Edytuj
        </Button>
      </Link>
    </div>
  );
}
