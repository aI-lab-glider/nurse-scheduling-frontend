/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { SummaryTableRow } from "./summarytable-row.component";
import { summaryTableSectionDataCy } from "./summarytable-section.models";
import { SectionWrapper } from "../../base/styled";
import styled from "styled-components";
import { colors } from "../../../../assets/colors";

export interface SummaryTableSectionOptions {
  dataRows: DataRow[];
  sectionIdx: number;
}

export function SummaryTableSection({
  dataRows,
  sectionIdx,
}: SummaryTableSectionOptions): JSX.Element {
  return (
    <Wrapper id="summaryTable" data-cy={summaryTableSectionDataCy(sectionIdx)}>
      <div>
        {dataRows.map((dataRow, rowIndex) => {
          return (
            <SummaryTableRow key={dataRow.rowKey} workerName={dataRow.rowKey} rowIndex={rowIndex} />
          );
        })}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled(SectionWrapper)`
  width: 130px;
  cursor: default;

  border: 1px solid ${colors.tableBorderGrey};
  border-radius: 10px;
`;
