/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ScheduleEditPage } from "./edit-page/schedule-edit.page";
import { ScheduleViewOnlyPage } from "./view-only-page/schedule-view-only.page";
import { useJiraLikeDrawer } from "../common-components/drawer/jira-like-drawer-context";
import * as Sentry from "@sentry/react";
import AppErrorModal from "../common-components/modal/app-error-modal/app-error.modal.component";
import { ScheduleActionType } from "../../state/reducers/month-state/schedule-data/schedule.actions";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { CorruptedScheduleComponent } from "./corrupted-schedule.component";

interface SchedulePageOptions {
  editModeHandler: (editMode: boolean) => void;
}

export function SchedulePage({ editModeHandler }: SchedulePageOptions): JSX.Element {
  const { setOpen: setDrawerOpen } = useJiraLikeDrawer();
  const dispatch = useDispatch();

  const [isOpenAppError, setIsAppErrorOpen] = useState(false);
  const { isCorrupted } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );

  const fallback = useCallback(
    ({ resetError }): JSX.Element => (
      <AppErrorModal onClick={resetError} open={isOpenAppError} setOpen={setIsAppErrorOpen} />
    ),
    [isOpenAppError, setIsAppErrorOpen]
  );

  const onError = (): void => {
    setIsAppErrorOpen(true);
    dispatch({
      type: ScheduleActionType.SET_SCHEDULE_CORRUPTED,
    });
  };

  const ViewOnly = useCallback(
    (): JSX.Element => (
      <>
        <ScheduleViewOnlyPage openEdit={(): void => editModeHandler(true)} />
      </>
    ),
    [editModeHandler]
  );

  const Edit = useCallback((): JSX.Element => {
    function handleEditButton(): void {
      editModeHandler(false);
      setDrawerOpen(false);
    }
    return (
      <>
        <ScheduleEditPage close={handleEditButton} />
      </>
    );
  }, [editModeHandler, setDrawerOpen]);

  return (
    <>
      <div className="schedule-container">
        <Sentry.ErrorBoundary fallback={fallback} onError={onError}>
          {isCorrupted ? (
            <CorruptedScheduleComponent />
          ) : (
            <Switch>
              <Route path="/schedule-editing" component={Edit} />
              <Route path="/" component={ViewOnly} exact />
            </Switch>
          )}
        </Sentry.ErrorBoundary>
      </div>
    </>
  );
}
