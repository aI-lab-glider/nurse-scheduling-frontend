import React, { useEffect, useState } from "react";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions, CellState } from "./cell-options.model";
import "./shift-cell.css";

export function ShiftCellComponent({ value, className = "", onDataChange }: CellOptions) {
  const [shift, setShift] = useState(value);
  const [style, setStyle] = useState(`${className} ${shift}`);

  function onStateChange(newState: CellState) {
    switch (newState) {
      case CellState.START_EDITING:
        setStyle(style.replace(shift as string, ""));
        break;
      case CellState.STOP_EDITING:
        setStyle(style);
        break;
    }
  }

  function onBaseCellUpdate(newShift: string) {
    setShift(newShift);
    if (onDataChange) {
      onDataChange(newShift);
    }
  }

  useEffect(() => {
    setStyle(`${className} ${shift}`);
  }, [shift]);

  return (
    <BaseCellComponent
      value={value === "W" ? "" : value}
      className={style}
      onStateChange={onStateChange}
      onDataChange={onBaseCellUpdate}
    ></BaseCellComponent>
  );
}
