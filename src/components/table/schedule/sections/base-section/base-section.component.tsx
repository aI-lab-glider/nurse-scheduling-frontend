import React, { useState } from "react";
import { BaseCellComponent } from "../../schedule-parts/base-cell.component";
import { ScheduleRowComponent } from "../../schedule-parts/schedule-row.component";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { ShiftRowOptions } from "../../schedule-parts/shift-row.component";
import { BaseCellOptions } from "../../schedule-parts/base-cell.component";
import { Sections } from "../../../../../logic/providers/schedule-provider.model";

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
  cellComponent?: (BaseCellOptions: BaseCellOptions) => JSX.Element;
  rowComponent?: React.FC<ShiftRowOptions>;
  sectionKey?: keyof Sections;
  onRowKeyClicked?: (rowIndex: number) => void;
}

export function BaseSectionComponent({
  uuid,
  data = [],
  cellComponent = BaseCellComponent,
  rowComponent: RowComponent = ScheduleRowComponent,
  sectionKey,
  onRowKeyClicked,
}: BaseSectionOptions): JSX.Element {
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
        newPosition = { row: -1, cell: -1 };
        break;
      default:
        return;
    }
    event.preventDefault();
    if (isInRange(newPosition) || (newPosition.row === -1 && newPosition.cell === -1)) {
      setPointerPosition(newPosition);
    }
  }
  return (
    <React.Fragment>
      {data.map((dataRow, index) => (
        <RowComponent
          uuid={uuid}
          sectionKey={sectionKey}
          key={`${dataRow.rowKey}${index}_${uuid}`}
          index={index + 1}
          dataRow={dataRow}
          showSelectedCells={pointerPosition.row === index}
          cellComponent={cellComponent}
          pointerPosition={pointerPosition.row === index ? pointerPosition.cell : -1}
          onKeyDown={movePointer}
          onClick={(cellIndex): void => setPointerPosition({ row: index, cell: cellIndex })}
          onRowKeyClick={(): void => onRowKeyClicked && onRowKeyClicked(index)}
          onBlur={(): void => setPointerPosition({ row: -1, cell: -1 })}
        />
      ))}
    </React.Fragment>
  );
}
