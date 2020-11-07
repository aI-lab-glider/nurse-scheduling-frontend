import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type ExtraWorkersSectionOptions = BaseSectionOptions;

export function ExtraWorkersSection(options: ExtraWorkersSectionOptions): JSX.Element {
  const { data = [] } = options;
  return <BaseSectionComponent {...options} sectionKey={"ExtraWorkersInfo"} data={data} />;
}
