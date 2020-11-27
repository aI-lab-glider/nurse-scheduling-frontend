import React, { useCallback, useContext } from "react";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { BaseRowComponent, BaseRowOptions } from "./base-row.component";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellOptions } from "./base-cell.component";
import { ShiftHelper } from "../../../../../helpers/shifts.helper";

export interface ShiftRowOptions extends BaseRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: React.FC<BaseCellOptions>;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow, sectionKey } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  // TODO: Move to logic

  const extendDataRowWithHoursInfo = useCallback(
    (dataRow: DataRow): DataRow => {
      const extraHours = ShiftHelper.rowWorkHoursInfo(dataRow, scheduleLogic, sectionKey);
      return new DataRow(dataRow.rowKey, [...dataRow.rowData(true, false), ...extraHours]);
    },
    [scheduleLogic, sectionKey]
  );

  return (
    <BaseRowComponent
      {...options}
      dataRow={extendDataRowWithHoursInfo(dataRow)}
      cellComponent={ShiftCellComponent}
    />
  );
}
