/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { SummaryTableRow } from "./summarytable-row.component";
import { summaryTableSectionDataCy } from "./summarytable-section.models";
import { SectionWrapper } from "../../base/styled";
import { colors } from "../../../../assets/colors";

export interface SummaryTableSectionOptions {
  data: DataRow[];
  sectionIndex: number;
}

export function SummaryTableSection({
  data,
  sectionIndex,
}: SummaryTableSectionOptions): JSX.Element {
  return (
    <div>
      <Wrapper id="summaryTable" data-cy={summaryTableSectionDataCy(sectionIndex)}>
        <div>
          {data.map((dataRow, rowIndex) => (
            <SummaryTableRow key={dataRow.rowKey} workerName={dataRow.rowKey} rowIndex={rowIndex} />
          ))}
        </div>
      </Wrapper>
    </div>
  );
}

const Wrapper = styled(SectionWrapper)`
  width: 130px;
  cursor: default;

  border: 1px solid ${colors.tableBorderGrey};
  border-radius: 10px;
`;
