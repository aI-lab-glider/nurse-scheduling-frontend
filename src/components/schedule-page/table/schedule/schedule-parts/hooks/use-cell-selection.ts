import { useEffect } from "react";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import mergeRefs from "react-merge-refs";

const PivotCellType = "Cell";

export interface PivotCell {
  type: string;
  rowIndex: number;
  cellIndex: number;
}

export interface UseCellSelectionOptions {
  sectionKey: string;
  rowIndex: number;
  cellIndex: number;
  isBlocked: boolean;
  onDrag: (pivotCell: PivotCell) => void;
  onDragEnd: () => void;
}

type SelectableItemRef = (instance: ConnectableElement) => void;

export function useCellSelection({
  sectionKey,
  rowIndex,
  cellIndex,
  isBlocked,
  onDrag,
  onDragEnd,
}: UseCellSelectionOptions): SelectableItemRef {
  const dragAnDropType = `${PivotCellType}${sectionKey ?? ""}`;
  const [, drop] = useDrop({
    accept: dragAnDropType,
    collect: (monitor) => {
      if (monitor.isOver()) {
        if (!isBlocked) {
          onDrag?.(monitor.getItem() as PivotCell);
        }
      }
    },
    drop: () => {
      onDragEnd?.();
    },
  });
  const [, drag, preview] = useDrag({
    item: {
      type: dragAnDropType,
      rowIndex: rowIndex,
      cellIndex: cellIndex,
    } as PivotCell,
    end: (item, monitor) => {
      if (!monitor.didDrop()) onDragEnd?.();
    },
  });
  // Below lines disable default preview image that is inserted by browser on dragging
  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  const selectableItemRef = mergeRefs([drop, drag]);
  return selectableItemRef;
}
