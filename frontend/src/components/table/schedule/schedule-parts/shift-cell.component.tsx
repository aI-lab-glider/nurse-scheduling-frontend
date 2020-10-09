import React, { useState } from "react";
import { WeekDay } from "../../../../state/models/schedule-data/month-info.model";
import { ShiftCode } from "../../../../state/models/schedule-data/shift-info.model";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";
import "./shift-cell.css";

export function ShiftCellComponent(
  options: CellOptions) {
  const {dayType, value, className, isEditable, onDataChanged, onContextMenu, isSelected} = options;
  const isWeekend = dayType === WeekDay.SA || dayType === WeekDay.SU;
  const [shift, setShift] = useState(value);
  const [isEditableState, setIsEditableState] = useState(isEditable);
  
  function onBaseCellUpdate(newShift: string) {
    setShift(newShift);
    if (onDataChanged) {
      onDataChanged(newShift);
    }
  }

  function handleContextMenu(index: number, isFrozen: boolean) {
    let newState = !isFrozen;
    setIsEditableState(newState);
    onContextMenu && onContextMenu(index, newState);
  }

  return (
    <BaseCellComponent
      {...options}
      value={value === ShiftCode.W ? "" : value}
      className={className + (isSelected ? "" : isWeekend ? "" : shift)}
      onDataChanged={onBaseCellUpdate}
      isEditable={isEditableState}
      onContextMenu={handleContextMenu}
    ></BaseCellComponent>
  );
}
