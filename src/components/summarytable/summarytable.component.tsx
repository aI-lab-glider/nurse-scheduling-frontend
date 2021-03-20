/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerGroup } from "../../common-models/worker-info.model";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { SummaryTableSection } from "./summarytable-section.component";

export interface SummaryTableOptions extends Partial<BaseSectionOptions> {
  workerGroup: WorkerGroup;
}

export function SummaryTableComponent(options: SummaryTableOptions): JSX.Element {
  const { data = [], workerGroup: workerType } = options;

  return (
    <div>
      <SummaryTableSection dataRows={data} workerGroup={workerType} />
    </div>
  );
}
