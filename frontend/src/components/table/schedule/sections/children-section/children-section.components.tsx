import React, { useContext } from "react";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { ChildrenSectionOptions } from "./children-section.options";

export function ChildrenSectionComponent(options: ChildrenSectionOptions) {
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
