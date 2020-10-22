import React, { useContext, useEffect, useState } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { CellOptions } from "./cell-options.model";
import { ScheduleRowComponent, ScheduleRowOptions } from "./schedule-row.component";
import { shiftCodeToWorkTime } from "../../../../helpers/shifts.helper";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { ShiftsInfoLogic } from "../../../../logic/schedule-logic/shifts-info.logic";

const WORK_HOURS_PER_DAY = 8;

export interface ShiftRowOptions extends ScheduleRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export function ShiftRowComponent(options: ShiftRowOptions) {
  const { dataRow, index, sectionKey, uuid } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  // TODO: Move to logic
  function calculateExtraHours(dataRow: DataRow) {
    const rowData = dataRow?.rowData(true, false) ?? [];
    const monthLogic = scheduleLogic?.metadataProvider?.monthLogic;
    const workingNorm =
      (monthLogic?.workingDaysNumber || 0) *
      WORK_HOURS_PER_DAY *
      ((scheduleLogic?.getProvider(
        sectionKey ?? ""
      ) as ShiftsInfoLogic)?.availableEmployeesWorkTime()[dataRow.rowKey] || 1);
    const numberOfPreviousMonthDays = monthLogic?.numberOfPreviousMonthDays;
    const workingHours = rowData
      .slice(numberOfPreviousMonthDays)
      .reduce((previousValue, currentValue) => {
        return previousValue + shiftCodeToWorkTime(currentValue);
      }, 0);
    return [workingNorm, workingHours, workingHours - workingNorm];
  }

  function extendDataRowWithHoursInfo(dataRow: DataRow) {
    const extraHours = calculateExtraHours(dataRow);
    return new DataRow(dataRow.rowKey, [...dataRow.rowData(true, false), ...extraHours]);
  }

  const [extendedDataRow, setExtendedDataRow] = useState(extendDataRowWithHoursInfo(dataRow));
  useEffect(() => {
    dataRow && setExtendedDataRow(extendDataRowWithHoursInfo(dataRow));
  }, [dataRow, uuid]);

  return (
    <ScheduleRowComponent
      {...options}
      uuid={uuid}
      index={index}
      dataRow={extendedDataRow}
      cellComponent={ShiftCellComponent}
      onStateUpdate={(newDataRow) => {
        setExtendedDataRow(extendDataRowWithHoursInfo(newDataRow));
      }}
    />
  );
}
