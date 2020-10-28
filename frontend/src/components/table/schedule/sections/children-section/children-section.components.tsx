import React, { useContext } from "react";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";

export type ChildrenSectionOptions = BaseSectionOptions;

export function ChildrenSectionComponent(options: ChildrenSectionOptions): JSX.Element {
  const { data = [] } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);

  return (
    <BaseSectionComponent
      {...options}
      sectionKey={scheduleLogic?.childrenInfoProvider.sectionKey || ""}
      data={data}
    />
  );
}
