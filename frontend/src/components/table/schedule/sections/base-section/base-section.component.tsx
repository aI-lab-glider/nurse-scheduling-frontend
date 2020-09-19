import React from "react";
import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { BaseCellComponent } from "../../schedule-parts/base-cell.component";
import { ScheduleRowComponent } from "../../schedule-parts/schedule-row.component";
import { BaseSectionOptions } from "./base-section.options";

export function BaseSectionComponent({
  data = [],
  onSectionUpdated,
  logic,
  cellComponent = BaseCellComponent,
}: BaseSectionOptions) {
  function onRowUpdated(row: DataRow) {
    const isSuccess = logic?.tryUpdate(row);
    if (isSuccess && logic) {
      onSectionUpdated(logic.sectionData);
    }
  }

  return (
    <React.Fragment>
      {data.map((dataRow, index) => (
        <ScheduleRowComponent
          onRowUpdated={onRowUpdated}
          key={`${dataRow.rowKey}${index}`}
          dataRow={dataRow}
          cellComponent={cellComponent}
        />
      ))}
    </React.Fragment>
  );
}
