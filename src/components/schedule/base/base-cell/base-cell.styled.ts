/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { fontSizeXs } from "../../../../assets/css-consts";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";

export const Wrapper = styled.div`
  flex: 1;
  height: 26px;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
  text-align: center;
  cursor: cell;
  padding: 0;
  overflow: hidden;
  background: #fff;

  &:first-child {
    border-left: 0;
  }

  &.weekend {
    background: ${({ theme }) => theme.calendarWeekend};
  }

  &.otherMonth {
    background: ${({ theme }) => theme.calendarOtherMonth};
  }
`;

export const ContentWrapper = styled.div`
  align-items: center;
  justify-content: center;
  align-self: center;
  /* padding: 4px 0 4px 0; */
`;

export const Popper = styled(ErrorPopper)`
  display: flex;
  justify-content: flex-start;
`;

export const CellWrapper = styled.div`
  display: flex;
  justify-content: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
  text-align: center;
`;

export const CellValue = styled.p`
  display: flex;
  align-self: center;
  /* display: flex;
  flex-direction: row;
  margin: auto;
  font-size: ${fontSizeXs};
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.75px;
  text-align: center;
  left: -2px;

  min-width: 10px;
  min-height: 10px;
  position: relative; */
`;
