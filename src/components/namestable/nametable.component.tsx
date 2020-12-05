import React from "react";
import { NameTableSection } from "./nametable-section.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";

export function NameTableComponent(options: Partial<BaseSectionOptions>): JSX.Element {
  const { data = [] } = options;

  return (
    <div>
      <NameTableSection dataRow={data} />
    </div>
  );
}
