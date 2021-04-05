/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ModeInfoActionCreator } from "../../../state/reducers/month-state/mode-info-reducer";
import { PERSISTENT_SCHEDULE_UNDOABLE_CONFIG } from "../../../state/reducers/month-state/schedule-data/schedule.actions";
import { UndoableHotkeys } from "../../../components/common-components";
import { ScheduleContainerComponent } from "../schedule-container.component";
import { ScheduleMode } from "../../../components/schedule/schedule-state.model";
import { ReadOnlyToolbar } from "./read-only-toolbar";

interface ScheduleViewOnlyPageOptions {
  openEdit: () => void;
}

export function ScheduleReadOnlyPage(props: ScheduleViewOnlyPageOptions): JSX.Element {
  const mode = useMemo(() => ScheduleMode.Readonly, []);
  const dispatch = useDispatch();
  useEffect(() => {
    const action = ModeInfoActionCreator.setMode(mode);
    dispatch(action);
  }, [dispatch, mode]);

  return (
    <>
      <UndoableHotkeys config={PERSISTENT_SCHEDULE_UNDOABLE_CONFIG} />
      <ReadOnlyToolbar openEdit={props.openEdit} />
      <div className={"schedule"}>
        <ScheduleContainerComponent mode={mode} />
      </div>
    </>
  );
}
