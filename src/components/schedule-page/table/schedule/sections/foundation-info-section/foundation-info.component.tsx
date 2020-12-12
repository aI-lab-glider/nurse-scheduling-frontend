import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
export type FoundationInfoOptions = Omit<BaseSectionOptions, "sectionKey">;

export function FoundationInfoComponent(options: FoundationInfoOptions): JSX.Element {
  return (
    <>
      <BaseSectionComponent {...options} sectionKey={"FoundationInfo"} />
    </>
  );
}
