import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type ChildrenSectionOptions = BaseSectionOptions;

export function ChildrenSectionComponent(options: ChildrenSectionOptions): JSX.Element {
  const { data = [] } = options;
  return <BaseSectionComponent {...options} sectionKey={"ChildrenInfo"} data={data} />;
}
