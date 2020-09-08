import React from "react";
import { DataRow } from "../../../logic/schedule/data-row.logic";
import { ScheduleCellComponent } from "./schedule-cell-component";


export function ScheduleRowComponent(dataRow: DataRow) {
    
    const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  return (
    <tr key={uuidv4()}>
      {dataRow.asValueArray().map((cellData) => {
        return ScheduleCellComponent(cellData);
      })}
    </tr>
  );
}
