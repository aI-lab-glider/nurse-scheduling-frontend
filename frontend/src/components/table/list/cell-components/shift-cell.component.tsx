import { Shift } from "../../../../state/models/schedule-data/shift-info.model";
import { BaseCellComponent } from "./base-cell.component";
import { Cell } from "./cell.model";
import "./shift-cell.css";

export function ShiftCellComponent(dataCell: Shift, className?: string): Cell {
  let value = dataCell;
  return BaseCellComponent(
    dataCell === "W" ? "" : (dataCell as string),
    `${className || ""} ${dataCell}`
  );
}
