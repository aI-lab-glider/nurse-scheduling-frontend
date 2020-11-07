import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type DateSectionOptions = BaseSectionOptions;

export function DateSectionComponent(options: DateSectionOptions): JSX.Element {
  return <BaseSectionComponent {...options} />;
}
