/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";
import { TimeTableRow } from "./timetable-row.component";
import { SectionWrapper } from "../../base/styled";
import { colors } from "../../../../assets/colors";

export function TimeTableSection(): JSX.Element {
  // TODO: Remove this component too

  return (
    <Wrapper>
      <TimeTableRow data-cy="timetable-row" />
    </Wrapper>
  );
}
export const Wrapper = styled(SectionWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;

  background: ${colors.white};
  box-sizing: border-box;

  overflow: hidden;
  border: 1px solid ${colors.tableBorderGrey};
  border-radius: 10px;
`;
