import React, { useCallback, useContext, useEffect, useState } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { BaseCellOptions } from "./base-cell-options.model";
import { ScheduleRowComponent, ScheduleRowOptions } from "./schedule-row.component";
import { shiftCodeToWorkTime } from "../../../../helpers/shifts.helper";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { ShiftsInfoLogic } from "../../../../logic/schedule-logic/shifts-info.logic";

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
      const rowData = dataRow?.rowData(true, false) ?? [];
      const monthLogic = scheduleLogic?.metadataProvider?.monthLogic;
      const workingNorm =
        (monthLogic?.workingDaysNumber || 0) *
        WORK_HOURS_PER_DAY *
        ((scheduleLogic?.getProvider(
          sectionKey ?? ""
        ) as ShiftsInfoLogic)?.availableWorkersWorkTime()[dataRow.rowKey] || 1);
      const numberOfPreviousMonthDays = monthLogic?.numberOfPreviousMonthDays;
      const workingHours = rowData
        .slice(numberOfPreviousMonthDays)
        .reduce((previousValue, currentValue) => {
          return previousValue + shiftCodeToWorkTime(currentValue);
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
