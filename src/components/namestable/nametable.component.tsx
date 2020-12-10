import React from "react";
import { NameTableSection } from "./nametable-section.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { WorkerType } from "../../common-models/worker-info.model";

interface NameSectionOptions extends Partial<BaseSectionOptions> {
  workerType: WorkerType;
}

export function NameTableComponent(options: NameSectionOptions): JSX.Element {
  const { data = [], workerType } = options;

  return (
    <div>
      <NameTableSection dataRow={data} workerType={workerType} />
    </div>
  );
}
