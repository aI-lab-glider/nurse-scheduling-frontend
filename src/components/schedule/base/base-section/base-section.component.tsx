/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useState } from "react";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import { DataRowHelper } from "../../../../helpers/data-row.helper";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { BaseCellComponent } from "../base-cell/base-cell.component";
import { BaseCellOptions } from "../base-cell/base-cell.models";
import { BaseRowComponent } from "../base-row/base-row.component";
import { ShiftRowOptions } from "../../worker-info-section/shifts-section/shift-row.component";
import { areDimesionsEqual, SelectionMatrix, useSelectionMatrix } from "./use-selection-matrix";

export enum DirectionKey {
  ArrowRight = "ArrowRight",
  ArrowLeft = "ArrowLeft",
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
}

type PointerPosition = { row: number; cell: number };
export interface BaseSectionOptions {
  data: DataRow[];
  cellComponent?: React.FC<BaseCellOptions>;
  sectionKey: string;
  rowComponent?: React.FC<ShiftRowOptions>;
  onRowKeyClicked?: (rowIndex: number) => void;
  updateData: (selectionMatrix: SelectionMatrix, oldData: DataRow[], newValue: string) => void;
  errorSelector?: (
    rowKey: string,
    cellIndex: number,
    scheduleErrors: GroupedScheduleErrors
  ) => ScheduleError[];
}

function BaseSectionComponentF({
  data = [],
  cellComponent = BaseCellComponent,
  rowComponent: RowComponent = BaseRowComponent,
  updateData,
  errorSelector,
  sectionKey,
}: BaseSectionOptions): JSX.Element {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>({ row: -1, cell: -1 });


  const dataArray = data.map((d) => d.rowData());
  const { selectionMatrix, setSelectionMatrix, resetSelectionMatrix } = useSelectionMatrix(
    dataArray
  );

  const resetSelection = useCallback((): void => {
    setPointerPosition({ row: -1, cell: -1 });
    resetSelectionMatrix();
  }, [resetSelectionMatrix, setPointerPosition]);



  const movePointer = useCallback((cellIndex: number, event: React.KeyboardEvent): void => {
    function isInRange(position: PointerPosition): boolean {
      return !!data[position.row] && !!data[position.row].rowData(false)[position.cell];
    }

    let newPosition: PointerPosition;
    switch (event.key) {
      case DirectionKey.ArrowDown:
        newPosition = { row: pointerPosition.row + 1, cell: pointerPosition.cell };
        break;
      case DirectionKey.ArrowUp:
        newPosition = { row: pointerPosition.row - 1, cell: pointerPosition.cell };
        break;
      case DirectionKey.ArrowRight:
        newPosition = { row: pointerPosition.row, cell: pointerPosition.cell + 1 };
        break;
      case DirectionKey.ArrowLeft:
        newPosition = { row: pointerPosition.row, cell: pointerPosition.cell - 1 };
        break;
      case "Escape":
        resetSelection();
        return;
      default:
        return;
    }
    event.preventDefault();
    if (isInRange(newPosition) || (newPosition.row === -1 && newPosition.cell === -1)) {
      setPointerPosition(newPosition);
    }
  }, [setPointerPosition, pointerPosition.row, pointerPosition.cell, data, resetSelection])




  const handleCellClick = useCallback(
    (rowInd: number, cellInd: number): void => {
      setSelectionMatrix(selectionMatrix, cellInd, rowInd);
      setPointerPosition({ row: rowInd, cell: cellInd });
    },
    [selectionMatrix, setSelectionMatrix, setPointerPosition]
  );

  const onSave = useCallback(
    (newValue: string): void => {
      updateData?.(selectionMatrix, data, newValue);
      resetSelection();
    },
    [selectionMatrix, updateData, resetSelection, data]
  );

  return (
    <>
      {areDimesionsEqual(selectionMatrix, dataArray) &&
        data.map((dataRow, rowInd) => (
          <RowComponent
            selection={[...selectionMatrix[rowInd]]}
            key={`${dataRow.rowKey}_${rowInd}`}
            rowIndex={rowInd}
            dataRow={dataRow}
            cellComponent={cellComponent}
            pointerPosition={pointerPosition.row === rowInd ? pointerPosition.cell : -1}
            onKeyDown={movePointer}
            /* eslint-disable-next-line react/jsx-no-bind */
            onClick={(cellInd): void => handleCellClick(rowInd, cellInd)}
            sectionKey={sectionKey}
            onSave={onSave}
            onBlur={resetSelection}
            isEditable={dataRow.isEditable}
            errorSelector={(cellIndex, scheduleErrors): ScheduleError[] =>
              errorSelector?.(dataRow.rowKey, cellIndex, scheduleErrors) ?? []
            }
          />
        ))}
    </>
  );
}


export const BaseSectionComponent = React.memo(BaseSectionComponentF, (prev, next) =>
  DataRowHelper.areDataRowArraysEqual(prev.data, next.data)
);
