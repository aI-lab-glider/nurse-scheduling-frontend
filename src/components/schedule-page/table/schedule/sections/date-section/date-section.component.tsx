import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type DateSectionOptions = Omit<BaseSectionOptions, "sectionKey">;

export function DateSectionComponent(options: DateSectionOptions): JSX.Element {
  return <BaseSectionComponent sectionKey={"Metadata"} {...options} />;
}
