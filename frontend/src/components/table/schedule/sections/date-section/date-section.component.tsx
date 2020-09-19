import React from "react";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { DateSectionOptions } from "./date-section.options";

export function DateSectionComponent({ data = [], onSectionUpdated }: DateSectionOptions) {
  return <BaseSectionComponent data={data} onSectionUpdated={onSectionUpdated} />;
}
