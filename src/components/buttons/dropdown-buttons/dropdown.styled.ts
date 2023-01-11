/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { alpha } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../../../assets/css-consts";
import { Button } from "../button-component/button.component";

export const ColorSample = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: 10px;

  &:hover {
    cursor: pointer;
  }
`;

export const ColorSampleRow = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;
`;

export const ColorSampleWrapper = styled.div`
  margin-top: 20px;
  padding: 10px 20px 20px;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const ButtonListWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 2px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 5px 30px 0 ${colors.gray400};
  position: relative;
  margin-top: 2px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${colors.white};
  white-space: nowrap;

  & > div:hover {
    cursor: pointer;
    background-color: ${alpha(colors.primary, 0.1)};
  }
`;
export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 27px;
  &:first-child {
    margin-top: 0px;
  }
  & svg {
    align-self: center;
  }
`;
export const DropdownButton = styled.div`
  position: relative;
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  padding-left: 33px;
  padding-right: 33px;
  color: ${({ theme }) => theme.primaryText};
`;

export const PlaceholderButton = styled(Button)`
  position: relative;
  padding: 0px;
  font-size: 14px;
  border-color: ${({ theme }) => theme.gray};
  width: var(--width) px;
`;

export const PlaceholderButtonContent = styled.div`
  flex: 1;
  padding-left: 6px;
  padding-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
`;
