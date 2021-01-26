/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Route, Switch } from "react-router-dom";
import { ScheduleEditPage } from "./edit-page/schedule-edit.page";
import { ScheduleViewOnlyPage } from "./view-only-page/schedule-view-only.page";

interface SchedulePageOptions {
  editModeHandler: (editMode: boolean) => void;
}

export function SchedulePage(props: SchedulePageOptions): JSX.Element {
  function ViewOnly(): JSX.Element {
    return (
      <>
        <ScheduleViewOnlyPage openEdit={(): void => props.editModeHandler(true)} />
      </>
    );
  }

  function Edit(): JSX.Element {
    return (
      <>
        <ScheduleEditPage closeEdit={(): void => props.editModeHandler(false)} />
      </>
    );
  }

  return (
    <>
      <div className="schedule-container">
        <Switch>
          <Route path="/schedule-editing" component={Edit} />
          <Route path="/" component={ViewOnly} exact />
        </Switch>
      </div>
      )
    </>
  );
}
