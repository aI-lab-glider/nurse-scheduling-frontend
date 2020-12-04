import React, { useContext, useMemo } from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { MonthInfoLogic } from "../../logic/schedule-logic/month-info.logic";
import { VerboseDate } from "../../common-models/month-info.model";
import { TimeTableCell } from "./timetable-cell.component";

export interface TimeTableRowOptions {
  uuid: string;
  dataRow: DataRow;
}

export function TimeTableRowF({ dataRow, uuid }: TimeTableRowOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);

  function getVerboseDates(): [VerboseDate[], number] {
    if (
      scheduleLogic?.sections.Metadata?.verboseDates &&
      scheduleLogic.sections.Metadata.verboseDates.length > 0
    ) {
      return [
        scheduleLogic?.sections.Metadata?.verboseDates,
        scheduleLogic.sections.Metadata.monthNumber,
      ];
    } else {
      const today = new Date();

      const monthLogic = new MonthInfoLogic(
        today.getMonth(),
        today.getFullYear().toString(),
        dataRow.rowData(),
        false
      );
      return [monthLogic.verboseDates, monthLogic.monthNumber];
    }
  }

  const [verboseDates, currMont] = getVerboseDates();

  const data = useMemo(() => dataRow.rowData(false), [dataRow]);
  return (
    <tr className="row" id="timetableRow">
      {data.map((cellData, cellIndex) => {
        return (
          <TimeTableCell
            key={`${dataRow.rowKey}_${cellData}_${cellIndex}${uuid}}`}
            value={verboseDates[cellIndex]}
            currMonth={currMont}
          />
        );
      })}
    </tr>
  );
}

export const TimeTableRow = React.memo(TimeTableRowF, (prev, next) => {
  return DataRowHelper.areDataRowsEqual(prev.dataRow, next.dataRow);
});
