import React, { useCallback, useContext, useEffect, useState } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { ScheduleRowComponent, ScheduleRowOptions } from "./schedule-row.component";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { ShiftsInfoLogic } from "../../../../logic/schedule-logic/shifts-info.logic";
import { BaseCellOptions } from "./base-cell.component";
import { ShiftHelper } from "../../../../helpers/shifts.helper";

const WORK_HOURS_PER_DAY = 8;

export interface ShiftRowOptions extends ScheduleRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (BaseCellOptions: BaseCellOptions) => JSX.Element;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow, index, sectionKey, uuid } = options;
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

  const [extendedDataRow, setExtendedDataRow] = useState(extendDataRowWithHoursInfo(dataRow));
  useEffect(() => {
    dataRow && setExtendedDataRow(extendDataRowWithHoursInfo(dataRow));
  }, [dataRow, extendDataRowWithHoursInfo, uuid]);

  return (
    <ScheduleRowComponent
      {...options}
      uuid={uuid}
      index={index}
      dataRow={extendedDataRow}
      cellComponent={ShiftCellComponent}
      onStateUpdate={(newDataRow): void => {
        setExtendedDataRow(extendDataRowWithHoursInfo(newDataRow));
      }}
    />
  );
}
