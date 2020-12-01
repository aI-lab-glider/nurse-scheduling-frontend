import React from "react";
import { SummaryTableSection } from "./summarytable-section.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";

export function SummaryTableComponent(options: BaseSectionOptions): JSX.Element {
  const { data = [] } = options;

  return (
    <div>
      <SummaryTableSection dataRow={data} />
    </div>
  );
}
