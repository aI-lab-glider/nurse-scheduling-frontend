import React, { useContext } from "react";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
import { ScheduleLogicContext } from "../../use-schedule-state";

export type ExtraWorkersSectionOptions = BaseSectionOptions;

export function ExtraWorkersSection(options: ExtraWorkersSectionOptions): JSX.Element {
  const { data = [] } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey = scheduleLogic?.extraWorkersInfoProvider.sectionKey;
  return <BaseSectionComponent {...options} sectionKey={sectionKey} data={data} />;
}
