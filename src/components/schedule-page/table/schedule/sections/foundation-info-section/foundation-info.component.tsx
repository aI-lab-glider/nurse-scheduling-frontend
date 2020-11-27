import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
export type FoundationInfoOptions = BaseSectionOptions;

export function FoundationInfoComponent(options: FoundationInfoOptions): JSX.Element {
  return (
    <React.Fragment>
      <BaseSectionComponent {...options} sectionKey={"FoundationInfo"} />
    </React.Fragment>
  );
}
