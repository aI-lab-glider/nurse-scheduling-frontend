/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { OvertimeHeaderRow } from "./overtime-header-row.component";
import { SectionWrapper } from "../../base/styled";

interface OvertimeHeaderTableOptions {
  data: string[];
}

export function OvertimeHeaderComponent(options: OvertimeHeaderTableOptions): JSX.Element {
  // TODO: Delete this component
  const { data } = options;

  return (
    <SectionWrapper id="overtimeHeaderTable">
      <OvertimeHeaderRow data={data} />
    </SectionWrapper>
  );
}
