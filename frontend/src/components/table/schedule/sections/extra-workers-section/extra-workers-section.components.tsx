import React, { useContext } from "react";
import { DataRowHelper } from "../../../../../helpers/row.helper";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { ExtraWorkersSectionOptions } from "./extra-workers-section.options";
import { ExtraWorkersLogic } from "../../../../../logic/real-schedule-logic/extra-workers.logic";
import { ScheduleLogicContext } from "../../use-schedule-state";

export function ExtraWorkersSection(options: ExtraWorkersSectionOptions) {
  const { data = [] } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey = scheduleLogic?.extraWorkersInfoProvider.sectionKey;
  return <BaseSectionComponent {...options} sectionKey={sectionKey} data={data} />;
}
