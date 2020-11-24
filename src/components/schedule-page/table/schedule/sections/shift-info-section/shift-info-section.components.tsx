import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type ChildrenSectionOptions = BaseSectionOptions;
export type ExtraWorkersSectionOptions = BaseSectionOptions;

export type ShiftInfoSectionOptions = BaseSectionOptions;

export function ShiftInfoSectionComponent(options: ShiftInfoSectionOptions): JSX.Element {
  return (
    <React.Fragment>
      <BaseSectionComponent {...options} sectionKey={"FoundationInfo"} />
    </React.Fragment>
  );
}
