import React from "react";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { DateSectionOptions } from "./date-section.options";

export function DateSectionComponent(options: DateSectionOptions): JSX.Element {
  return <BaseSectionComponent {...options} />;
}
