import React, { useEffect, useState } from "react";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions, CellState } from "./cell-options.model";
import "./shift-cell.css";

export function ShiftCellComponent({ value, className = "", dayType ,onDataChanged, isEditable, onContextMenu, index }: CellOptions) {
  const isWeekend = dayType === "SA" || dayType === "SU";
  const [shift, setShift] = useState(value);
  const [style, setStyle] = useState(`${className} ${ isWeekend ? '' : shift}`);
  const [isEditableState, setIsEditableState] = useState(isEditable);
  function onStateChange(newState: CellState) {
    switch (newState) {
      case CellState.START_EDITING:
        if (!isWeekend) {
          setStyle(style.replace(shift as string, ""));
        }
      break;
      case CellState.STOP_EDITING:
        setStyle(style);
        break;
    }
  }

  function onBaseCellUpdate(newShift: string) {
    setShift(newShift);
    if (onDataChanged) {
      onDataChanged(newShift);
    }
  }

  useEffect(() => {
    setStyle(`${className} ${isWeekend ? '' : shift }`);
  }, [shift, className]);

  function handleContextMenu(index: number, isFrozen: boolean) {
    let newState = !isFrozen;
    setIsEditableState(newState);
    onContextMenu && onContextMenu(index, newState);
  }

  return (
    <BaseCellComponent
      index={index}
      dayType= {dayType}
      value={value === "W" ? "" : value}
      className={style}
      onStateChange={onStateChange}
      onDataChanged={onBaseCellUpdate}
      isEditable={isEditableState}
      onContextMenu={handleContextMenu}
    ></BaseCellComponent>
  );
}
