/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { BaseSectionOptions } from "../../base/base-section/base-section.component";
import { SummaryTableSection } from "./summarytable-section.component";

export interface SummaryTableOptions extends Partial<BaseSectionOptions> {
  sectionIndex: number;
}

export function SummaryTableComponent(options: SummaryTableOptions): JSX.Element {
  // TODO: Remove this component

  const { data = [], sectionIndex: sectionIdx } = options;

  return (
    <div>
      <SummaryTableSection dataRows={data} sectionIdx={sectionIdx} />
    </div>
  );
}
