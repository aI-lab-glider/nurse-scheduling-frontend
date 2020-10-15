import React, { useEffect, useState } from "react";
import { BaseCellComponent } from "../../schedule-parts/base-cell.component";
import { ScheduleRowComponent } from "../../schedule-parts/schedule-row.component";
import { ShiftRowOptions } from "../../schedule-parts/shift-row.component";
import { BaseSectionOptions } from "./base-section.options";

export enum DirectionKey {
  ArrowRight = "ArrowRight",
  ArrowLeft = "ArrowLeft",
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
}

type PointerPosition = { row: number; cell: number };

export function BaseSectionComponent({
  data = [],
  cellComponent = BaseCellComponent,
  rowComponent: RowComponent = ScheduleRowComponent,
  sectionKey,
}: BaseSectionOptions) {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>({ row: -1, cell: -1 });

  function isInRange(position: PointerPosition) {
    return !!data[position.row] && !!data[position.row].rowData(false)[position.cell];
  }

  function movePointer(cellIndex: number, event: React.KeyboardEvent) {
    if (!Object.keys(DirectionKey).includes(event.key)) return;
    event.preventDefault();
    let newPosition;
    switch (DirectionKey[event.key]) {
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
    }
    if (isInRange(newPosition)) {
      setPointerPosition(newPosition);
    }
  }
  return (
    <React.Fragment>
      {data.map((dataRow, index) => (
        <RowComponent
          sectionKey={sectionKey}
          key={`${dataRow.rowKey}${index}`}
          index={index + 1}
          dataRow={dataRow}
          cellComponent={cellComponent}
          pointerPosition={pointerPosition.row === index ? pointerPosition.cell : -1}
          onKeyDown={movePointer}
          onClick={(cellIndex) => setPointerPosition({ row: index, cell: cellIndex })}
        />
      ))}
    </React.Fragment>
  );
}
