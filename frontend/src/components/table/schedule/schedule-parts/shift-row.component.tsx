import React from "react";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { MetadataLogic } from "../../../../logic/real-schedule-logic/metadata.logic";
import { CellOptions } from "./cell-options.model";
import { ScheduleRowComponent } from "./schedule-row.component";
import { shiftCodeToWorkTime } from "../../../../helpers/shift-time.helper";

const WORK_HOURS_PER_DAY = 8;

export interface ShiftRowOptions {
  dataRow?: DataRow;
  metaDataLogic?: MetadataLogic;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

export const ShiftRowComponent: React.FC<ShiftRowOptions> = ({
  dataRow,
  cellComponent,
  onRowUpdated,
  metaDataLogic,
}) => {
  const rowData = dataRow?.rowData(true, false) ?? [];
  const workingNorm = (metaDataLogic ? metaDataLogic.workingDaysNumber : 0) * WORK_HOURS_PER_DAY; // TODO uwzględnić etat pracownika
  const numberOfPreviousMonthDays = metaDataLogic?.numberOfPreviousMonthDays;
  const workingHours = rowData.slice(numberOfPreviousMonthDays).reduce((previousValue, currentValue) => {
    return previousValue + shiftCodeToWorkTime(currentValue);
  }, 0);
  const newDataRows =
    dataRow &&
    new DataRow(dataRow.rowKey, [
      ...rowData,
      workingNorm,
      workingHours,
      workingHours - workingNorm,
    ]);

  return (
    <ScheduleRowComponent
      dataRow={newDataRows}
      cellComponent={cellComponent}
      onRowUpdated={onRowUpdated}
      metaDataLogic={metaDataLogic}
    />
  );
};
