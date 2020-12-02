import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import {
  ScheduleLogicContext,
  useScheduleState,
} from "../schedule-page/table/schedule/use-schedule-state";
import { SummaryTableRow } from "./summarytable-row.component";
import { DataRow } from "../../logic/schedule-logic/data-row";

export interface NameTableCellOptions {
  dataRow: DataRow[];
}

export function SummaryTableSection({ dataRow }: NameTableCellOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);

  const { scheduleLogic, scheduleLocalState, setNewSchedule } = useScheduleState(scheduleModel);

  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  return (
    <React.Fragment>
      <table className="table" id="summaryTable">
        <tbody>
          <ScheduleLogicContext.Provider value={scheduleLogic}>
            {dataRow.map((cellData) => {
              return (
                <SummaryTableRow
                  key={`${scheduleLocalState.uuid}_${cellData.rowKey}`}
                  uuid={scheduleLocalState.uuid}
                  dataRow={cellData}
                />
              );
            })}
          </ScheduleLogicContext.Provider>
        </tbody>
      </table>
    </React.Fragment>
  );
}
