import React, { useContext, useEffect, useState } from "react";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { MetadataLogic } from "../../../../logic/real-schedule-logic/metadata.logic";
import { CellOptions } from "./cell-options.model";
import { ScheduleRowComponent, ScheduleRowOptions } from "./schedule-row.component";
import { shiftCodeToWorkTime } from "../../../../helpers/shift-time.helper";
import { ShiftCellComponent } from "./shift-cell.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent } from "./base-cell.component";

const WORK_HOURS_PER_DAY = 8;

export interface ShiftRowOptions extends ScheduleRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export const ShiftRowComponent: React.FC<ShiftRowOptions> = (options) => {
  const { dataRow, index } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);

  function calculateExtraHours(dataRow: DataRow) {
    const rowData = dataRow?.rowData(true, false) ?? [];
    const monthLogic = scheduleLogic?.metadataProvider?.monthLogic;
    const workingNorm = (monthLogic?.workingDaysNumber || 0) * WORK_HOURS_PER_DAY; // TODO uwzględnić etat pracownika
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
  }, [dataRow]);

  return (
    <ScheduleRowComponent
      {...options}
      index={index}
      dataRow={extendedDataRow}
      cellComponent={ShiftCellComponent}
      onStateUpdate={(newDataRow) => {
        setExtendedDataRow(extendDataRowWithHoursInfo(newDataRow));
      }}
    />
  );
};
