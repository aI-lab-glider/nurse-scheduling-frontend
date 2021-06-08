/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { ArrayHelper } from "../../../../helpers/array.helper";
import { OvertimeHeaderCell } from "./overtime-header-cell.component";
import { SectionRow, SectionWrapper } from "../../base/styled";

export interface OvertimeHeaderRowOptions {
  data: string[];
}

function OvertimeHeaderRowF({ data }: OvertimeHeaderRowOptions): JSX.Element {
  return (
    <Wrapper>
      <SummaryRow>
        {data.map((cellData) => (
          <OvertimeHeaderCell value={cellData} key={cellData} />
        ))}
      </SummaryRow>
    </Wrapper>
  );
}

export const OvertimeHeaderRow = React.memo(OvertimeHeaderRowF, (prev, next) =>
  ArrayHelper.arePrimitiveArraysEqual(prev.data, next.data)
);

const SummaryRow = styled(SectionRow)`
  height: 40px;
  width: 130px;
`;

const Wrapper = styled(SectionWrapper)`
  height: 71px;
  cursor: default;
`;
