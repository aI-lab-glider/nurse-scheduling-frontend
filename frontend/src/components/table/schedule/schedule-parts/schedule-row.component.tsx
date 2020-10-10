import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { MetadataLogic } from "../../../../logic/real-schedule-logic/metadata.logic";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions, CellState } from "./cell-options.model";
import "./schedule-row.component.css";

export interface ScheduleRowOptions {
  dataRow?: DataRow;
  metaDataLogic?: MetadataLogic,
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
}

interface Errors {
  rowErrors: string[];
  cellErrors: string[][];
}
export function ScheduleRowComponent({
  dataRow,
  cellComponent: CellComponent = BaseCellComponent,
  onRowUpdated,
  metaDataLogic,
}: ScheduleRowOptions) {

  const errors = useSelector((state: ApplicationStateModel) => {
    let errors = state.scheduleErrors;
    return errors?.filter((e) => e.worker && e.worker == dataRow?.rowKey).join(" ");
  });

  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  const dispatcher = useDispatch();
  let nurse = dataRow?.rowKey ?? "";
  let data = dataRow?.rowData(false) || [];
  const verboseDates = metaDataLogic?.verboseDates;

  function onShiftChange(index: number, newShift: string) {
    dataRow = dataRow as DataRow;
    dataRow.setValue(selectedCells, newShift);
    if (onRowUpdated) {
      onRowUpdated(dataRow);
    }
    setSelectedCells([]);
  }

  function changeCellFrozenState(index: number, state: boolean) {
    let frozenDatesAction = metaDataLogic?.changeShiftFrozenState(nurse, index, !state);
    dispatcher(frozenDatesAction);
  }

  function registerCell(index: number) {
    setSelectedCells([...selectedCells, index]);
  }

  function onCellStateChanged(cellState: CellState) {
    switch (cellState) {
      case CellState.STOP_EDITING:
        setSelectedCells([]);
        break;
    }
  }

  return (
    <tr className="row">
      <BaseCellComponent
        index={0}
        value={nurse || ""}
        className={`key ${!dataRow || dataRow?.isEmpty ? "empty" : ""} ${errors}`}
      />
      {data.map((cellData, index) => {
        return (
          <CellComponent
            index={index}
            key={`${cellData}${index}`}
            value={cellData}
            dayType={verboseDates?.[index].dayOfWeek || ""}
            onDataChanged={(newValue) => onShiftChange(index, newValue)}
            className={`${!dataRow || dataRow?.isEmpty ? "empty" : ""}`}
            isEditable={!verboseDates?.[index].isFrozen}
            onContextMenu={changeCellFrozenState}
            pushToRow={registerCell}
            isSelected={selectedCells.includes(index)}
            onStateChange={onCellStateChanged}
          />
        );
      })}
    </tr>
  );
}
