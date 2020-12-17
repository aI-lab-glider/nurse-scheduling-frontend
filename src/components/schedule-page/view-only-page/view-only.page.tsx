import React from "react";
import { ScheduleComponent } from "../table/schedule/schedule.component";
import { ViewOnlyToolbar } from "./view-only-toolbar";

interface ScheduleViewOnlyPageOptions {
  openEdit: () => void;
}

export function ScheduleViewOnlyPage(props: ScheduleViewOnlyPageOptions): JSX.Element {
  return (
    <>
      <ViewOnlyToolbar openEdit={props.openEdit} />
      <div className={"schedule"}>
        <ScheduleComponent />
      </div>
    </>
  );
}
