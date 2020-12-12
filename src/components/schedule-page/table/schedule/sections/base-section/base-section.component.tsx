import React, { useContext, useState } from "react";
import { BaseCellComponent, PivotCell } from "../../schedule-parts/base-cell/base-cell.component";
import { BaseRowComponent } from "../../schedule-parts/base-row.component";
import { DataRow } from "../../../../../../logic/schedule-logic/data-row";
import { ShiftRowOptions } from "../../schedule-parts/shift-row.component";
import { BaseCellOptions } from "../../schedule-parts/base-cell/base-cell.component";
import { Sections } from "../../../../../../logic/providers/schedule-provider.model";
import { DataRowHelper } from "../../../../../../helpers/data-row.helper";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useSelectionMatrix } from "./use-selection-matrix";

export enum DirectionKey {
  ArrowRight = "ArrowRight",
  ArrowLeft = "ArrowLeft",
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
}

type PointerPosition = { row: number; cell: number };
export interface BaseSectionOptions {
  uuid: string;
  data?: DataRow[];
  cellComponent?: React.FC<BaseCellOptions>;
  rowComponent?: React.FC<ShiftRowOptions>;
  sectionKey: keyof Sections;
  onRowKeyClicked?: (rowIndex: number) => void;
}

function BaseSectionComponentF({
  uuid,
  data = [],
  cellComponent = BaseCellComponent,
  rowComponent: RowComponent = BaseRowComponent,
  sectionKey,
}: BaseSectionOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>({ row: -1, cell: -1 });

  function isInRange(position: PointerPosition): boolean {
    return !!data[position.row] && !!data[position.row].rowData(false)[position.cell];
  }

  function movePointer(cellIndex: number, event: React.KeyboardEvent): void {
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
  }

  function resetSelection(): void {
    setPointerPosition({ row: -1, cell: -1 });
    resetSelectionMatrix();
  }

  const { selectionMatrix, setSelectionMatrix, resetSelectionMatrix } = useSelectionMatrix(
    data.map((d) => d.rowData())
  );

  function onDrag(pivot: PivotCell, rowInd: number, cellInd: number): void {
    setSelectionMatrix(selectionMatrix, pivot.cellIndex, pivot.rowIndex, cellInd, rowInd);
  }

  function handleCellClick(rowInd: number, cellInd: number): void {
    setSelectionMatrix(selectionMatrix, cellInd, rowInd, cellInd, rowInd);
    setPointerPosition({ row: rowInd, cell: cellInd });
  }

  function onSave(newValue: string): void {
    scheduleLogic?.updateSection(sectionKey, selectionMatrix, newValue);
    resetSelection();
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {data.map((dataRow, rowInd) => (
        <RowComponent
          selection={selectionMatrix[rowInd]}
          uuid={uuid}
          sectionKey={sectionKey}
          key={`${dataRow.rowKey}${rowInd}_${uuid}`}
          index={rowInd}
          dataRow={dataRow}
          cellComponent={cellComponent}
          pointerPosition={pointerPosition.row === rowInd ? pointerPosition.cell : -1}
          onKeyDown={movePointer}
          onClick={(cellInd): void => handleCellClick(rowInd, cellInd)}
          onDrag={(pivot, cellInd): void => onDrag(pivot, rowInd, cellInd)}
          onDragEnd={(rowIndex, cellIndex): void =>
            setPointerPosition({ row: rowIndex, cell: cellIndex })
          }
          onSave={(newValue): void => onSave(newValue)}
          onBlur={resetSelection}
          isEditable={dataRow.isEditable}
        />
      ))}
    </DndProvider>
  );
}

export const BaseSectionComponent = React.memo(BaseSectionComponentF, (prev, next) => {
  const areEqual =
    prev.uuid === next.uuid && DataRowHelper.areDataRowArraysEqual(prev.data, next.data);
  return areEqual;
});
