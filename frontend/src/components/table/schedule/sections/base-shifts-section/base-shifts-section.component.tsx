import React from "react";
import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { BaseCellComponent } from "../../schedule-parts/base-cell.component";
import { BaseSectionOptions } from "../base-section/base-section.options";
import {ShiftRowComponent} from "../../schedule-parts/shift-row.component";

export function BaseShiftsSectionComponent({
  data = [],
  onSectionUpdated,
  logic,
  metaDataLogic,
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
        <ShiftRowComponent
          metaDataLogic={metaDataLogic}
          onRowUpdated={onRowUpdated}
          key={`${dataRow.rowKey}${index}`}
          dataRow={dataRow}
          cellComponent={cellComponent}
        />
      ))}
    </React.Fragment>
  );
}
