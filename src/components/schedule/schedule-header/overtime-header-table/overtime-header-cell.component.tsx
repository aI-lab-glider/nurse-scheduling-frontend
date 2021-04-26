/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { colors } from "../../../../assets/colors";

export interface OvertimeHeaderCellOptions {
  value: string;
}

function OvertimeHeaderCellF({ value }: OvertimeHeaderCellOptions): JSX.Element {
  return (
    <Wrapper>
      <RotatedText>{value}</RotatedText>
    </Wrapper>
  );
}

export const OvertimeHeaderCell: React.FC<OvertimeHeaderCellOptions> = React.memo(
  OvertimeHeaderCellF,
  (prev, next) => {
    return prev.value === next.value;
  }
);

const Wrapper = styled.div`
  padding-top: 100%;
  padding-bottom: 100%;
  align-content: center;
  position: relative;
  bottom: 25%;

  height: 100%;
  width: 100%;
  border-left: 1px solid ${colors.tableBorderGrey};

  color: ${colors.tableColor};
  background: ${colors.currMonthBackground};

  &:first-child {
    border-left: 0;
  }
`;

const RotatedText = styled.span`
  writing-mode: vertical-rl;
  -ms-writing-mode: tb-lr;
  transform: rotate(180deg);
  letter-spacing: 0.4px;
  margin-top: -5px;
`;
