import React from "react";
import { DataRowHelper } from "../../../../../helpers/row.helper";
import { ChildrenInfoLogic } from "../../../../../logic/real-schedule-logic/children-info.logic";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { ChildrenSectionOptions } from "./children-section.options";

export function ChildrenSectionComponent({
  data = [],
  metaDataLogic,
  onSectionUpdated,
}: ChildrenSectionOptions) {
  const logic = new ChildrenInfoLogic(DataRowHelper.dataRowsAsValueDict<number>(data, true));

  return (
    (
    <BaseSectionComponent
          data={data}
          metaDataLogic={metaDataLogic}
          onSectionUpdated={onSectionUpdated}
          logic={logic}
      />
  )
  );
}
