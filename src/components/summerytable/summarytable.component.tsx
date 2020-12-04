import React from "react";
import { SummaryTableSection } from "./summarytable-section.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { WorkerType } from "../../common-models/worker-info.model";

interface SummaryTableOptions extends Partial<BaseSectionOptions> {
  workerType: WorkerType;
}

export function SummaryTableComponent(options: SummaryTableOptions): JSX.Element {
  const { data = [], workerType } = options;

  return (
    <div>
      <SummaryTableSection dataRows={data} workerType={workerType} />
    </div>
  );
}
