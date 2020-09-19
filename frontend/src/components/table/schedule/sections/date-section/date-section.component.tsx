import React from "react";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { DateSectionOptions } from "./date-section.options";

export function DateSectionComponent({
  data = [],
  onSectionUpdated,
  metaDataLogic,
}: DateSectionOptions) {
  return (
    <BaseSectionComponent
      data={data}
      metaDataLogic={metaDataLogic}
      onSectionUpdated={onSectionUpdated}
    />
  );
}
