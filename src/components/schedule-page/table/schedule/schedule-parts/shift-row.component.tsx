import React, { useCallback, useContext } from "react";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { BaseRowComponent, BaseRowOptions } from "./base-row.component";
import { ShiftCellComponent } from "./shift-cell/shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellOptions } from "./base-cell/base-cell.component";
import { ShiftsInfoLogic } from "../../../../../logic/schedule-logic/shifts-info.logic";

export interface ShiftRowOptions extends BaseRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: React.FC<BaseCellOptions>;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow, sectionKey } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);

  const extendDataRowWithHoursInfo = useCallback(
    (dataRow: DataRow): DataRow => {
      const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);
      const hoursInfo = shiftLogic?.calculateWorkerHourInfo(dataRow.rowKey) ?? [];
      return new DataRow(dataRow.rowKey, [...dataRow.rowData(true, false), ...hoursInfo]);
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
