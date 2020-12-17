import React, { useContext } from "react";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { TimeTableRow } from "./timetable-row.component";

export function TimeTableSection(): JSX.Element {
  const { schedule: scheduleLocalState } = useContext(ScheduleLogicContext);

  function getDataRow(): DataRow {
    if (scheduleLocalState.isInitialized) {
      const d = scheduleLocalState.dateSection?.values().next().value as DataRow;
      if (!d.isEmpty) {
        return d;
      }
    }
    const today = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return new DataRow(
      "Dni miesiąca",
      Array.from({ length: today.getDate() }, (_, i) => i + 1)
    );
  }

  const data = getDataRow();

  return (
    <React.Fragment>
      <table className="table">
        <tbody>
          <TimeTableRow uuid={scheduleLocalState.uuid} dataRow={data} />
        </tbody>
      </table>
    </React.Fragment>
  );
}
