import React from "react";
import { StringHelper } from "../../../../helpers/string.helper";
import "./base-cell.css";
import { Cell } from "./cell.model";

export function BaseCellComponent(dataCell: string, className?: string): Cell {
  return (
    <td className={`cell ${className || ""}`} key={StringHelper.generateUuidv4()}>
      {dataCell}
    </td>
  ) as Cell;
}
