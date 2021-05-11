/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { OvertimeHeaderRow } from "./overtime-header-row.component";
import { SectionWrapper } from "../../base/styled";

interface OvertimeHeaderTableOptions {
  data: string[];
}

export function OvertimeHeaderComponent(options: OvertimeHeaderTableOptions): JSX.Element {
  // TODO: Delete this component
  const { data } = options;

  return (
    <Wrapper id="overtimeHeaderTable">
      <OvertimeHeaderRow data={data} />
    </Wrapper>
  );
}

const Wrapper = styled(SectionWrapper)`
  height: 71px;
  cursor: default;
`;
