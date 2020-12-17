import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleEditPage } from "./edit-page/schedule-edit.page";
import { ScheduleLogicContext, useScheduleState } from "./table/schedule/use-schedule-state";
import { ScheduleViewOnlyPage } from "./view-only-page/view-only.page";

interface SchedulePageOptions {
  editModeHandler: (editMode: boolean) => void;
}

export function SchedulePage(props: SchedulePageOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);
  const { scheduleLogic, setNewSchedule, scheduleLocalState } = useScheduleState(scheduleModel);
  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

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
    <ScheduleLogicContext.Provider
      value={{
        logic: scheduleLogic,
        schedule: scheduleLocalState,
      }}
    >
      <div className="schedule-container">
        <Switch>
          <Route path="/" component={ViewOnly} exact />
          <Route path="/schedule-editing" component={Edit} />
        </Switch>
      </div>
    </ScheduleLogicContext.Provider>
  );
}
