/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import * as S from "./styled";
import { summaryCellDataCy, SummaryTableCellOptions } from "./summarytable-cell.models";
import { colors } from "../../../../assets/colors";

function SummaryTableCellF({ value, cellIndex }: SummaryTableCellOptions): JSX.Element {
  return (
    <Wrapper data-cy={summaryCellDataCy(cellIndex)}>
      <span>{value}</span>
    </Wrapper>
  );
}

export const SummaryTableCell: React.FC<SummaryTableCellOptions> = React.memo(
  SummaryTableCellF,
  (prev, next) => prev.value === next.value
);

const Wrapper = styled.div`
  flex: 1 1 auto;
  align-items: center;
  height: 103%;
  width: 120%;
  border-top: 1px solid ${colors.tableBorderGrey};
  border-left: 1px solid ${colors.tableBorderGrey};

  padding-top: 8%;

  color: ${colors.cellColor};
  background: ${colors.white};

  &:first-child {
    border-left: 0;
  }
`;
