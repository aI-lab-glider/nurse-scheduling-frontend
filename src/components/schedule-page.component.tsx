import React from "react";
import { Route, Switch } from "react-router-dom";
import ScheduleViewOnlyMode from "./schedule-page/schedule-view-only-mode.component";
import { ScheduleEditMode } from "./schedule-page/schedule-edit-mode.component";

interface SchedulePageOptions {
  editModeHandler: (editMode: boolean) => void;
}

export function SchedulePage(props: SchedulePageOptions): JSX.Element {
  function ViewOnly(): JSX.Element {
    return (
      <>
        <ScheduleViewOnlyMode openEdit={(): void => props.editModeHandler(true)} />
      </>
    );
  }

  function Edit(): JSX.Element {
    return (
      <>
        <ScheduleEditMode closeEdit={(): void => props.editModeHandler(false)} />
      </>
    );
  }

  return (
    <div className="schedule-container">
      <Switch>
        <Route path="/" component={ViewOnly} exact />
        <Route path="/schedule-editing" component={Edit} />
      </Switch>
    </div>
  );
}
