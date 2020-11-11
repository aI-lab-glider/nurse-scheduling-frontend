import React, { useCallback, useContext } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { BaseRowComponent, BaseRowOptions } from "./base-row.component";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { ShiftsInfoLogic } from "../../../../logic/schedule-logic/shifts-info.logic";
import { BaseCellOptions } from "./base-cell.component";
import { ShiftHelper } from "../../../../helpers/shifts.helper";

const WORK_HOURS_PER_DAY = 8;

export interface ShiftRowOptions extends BaseRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: React.FC<BaseCellOptions>;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow, sectionKey } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  // TODO: Move to logic

  const calculateExtraHours = useCallback(
    (dataRow: DataRow): [number, number, number] => {
      if (!sectionKey) return [0, 0, 0];
      const rowData = dataRow?.rowData(true, false) ?? [];
      const monthLogic = scheduleLogic?.sections.Metadata?.monthLogic;
      const workingNorm =
        (monthLogic?.workingDaysNumber || 0) *
        WORK_HOURS_PER_DAY *
        (scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey)?.availableWorkersWorkTime[
          dataRow.rowKey
        ] || 1);
      const numberOfPreviousMonthDays = monthLogic?.numberOfPreviousMonthDays;
      const workingHours = rowData
        .slice(numberOfPreviousMonthDays)
        .reduce((previousValue, currentValue) => {
          return previousValue + ShiftHelper.shiftCodeToWorkTime(currentValue);
        }, 0);
      return [workingNorm, workingHours, workingHours - workingNorm];
    },
    [scheduleLogic, sectionKey]
  );

  const extendDataRowWithHoursInfo = useCallback(
    (dataRow: DataRow): DataRow => {
      const extraHours = calculateExtraHours(dataRow);
      return new DataRow(dataRow.rowKey, [...dataRow.rowData(true, false), ...extraHours]);
    },
    [calculateExtraHours]
  );

  return (
    <BaseRowComponent
      {...options}
      dataRow={extendDataRowWithHoursInfo(dataRow)}
      cellComponent={ShiftCellComponent}
    />
  );
}
