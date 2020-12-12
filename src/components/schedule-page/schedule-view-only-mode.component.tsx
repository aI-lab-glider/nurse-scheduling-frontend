import React from "react";
import { ImportButtonsComponent } from "./import-buttons/import-buttons.component";
import { Button } from "../common-components";
import { ScheduleComponent } from "./table/schedule/schedule.component";
import { Link } from "react-router-dom";

interface PropsType {
  openEdit: () => void;
}

export default function ScheduleViewOnlyMode(props: PropsType): JSX.Element {
  return (
    <>
      <div className={"buttons"}>
        <div className={"filler"} />
        <ImportButtonsComponent />
        <Link to={"/schedule-editing"}>
          <Button
            onClick={(): void => props.openEdit()}
            size="small"
            className="submit-button"
            variant="primary"
          >
            Edytuj
          </Button>
        </Link>
      </div>
      <div className={"schedule"}>
        <ScheduleComponent />
      </div>
    </>
  );
}
