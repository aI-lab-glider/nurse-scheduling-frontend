import React from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type ChildrenSectionOptions = BaseSectionOptions;
export type ExtraWorkersSectionOptions = BaseSectionOptions;

export type ShiftInfoSectionOptions = {
  childrenOptions: ChildrenSectionOptions;
  workersOptions: ExtraWorkersSectionOptions;
};

export function ShiftInfoSectionComponent(options: ShiftInfoSectionOptions): JSX.Element {
  return (
    <React.Fragment>
      <BaseSectionComponent
        {...options.childrenOptions}
        sectionKey={"ChildrenInfo"}
        data={options.childrenOptions.data}
      />
      <BaseSectionComponent
        {...options.workersOptions}
        sectionKey={"ExtraWorkersInfo"}
        data={options.workersOptions.data}
      />
    </React.Fragment>
  );
}
