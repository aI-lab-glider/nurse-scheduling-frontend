/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import { Route, Switch } from "react-router-dom";
import { ScheduleEditPage } from "./edit-page/schedule-edit.page";
import { ScheduleViewOnlyPage } from "./view-only-page/schedule-view-only.page";

interface SchedulePageOptions {
  editModeHandler: (editMode: boolean) => void;
}

export function SchedulePage({ editModeHandler }: SchedulePageOptions): JSX.Element {
  const ViewOnly = useCallback(
    (): JSX.Element => (
      <>
        <ScheduleViewOnlyPage openEdit={(): void => editModeHandler(true)} />
      </>
    ),
    [editModeHandler]
  );

  const Edit = useCallback(
    (): JSX.Element => (
      <>
        <ScheduleEditPage closeEdit={(): void => editModeHandler(false)} />
      </>
    ),
    [editModeHandler]
  );

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
