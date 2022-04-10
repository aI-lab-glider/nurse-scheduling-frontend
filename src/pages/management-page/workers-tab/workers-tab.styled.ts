/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import {
  TableCell as MaterialTableCell,
  TableContainer as MaterialTableContainer,
  TableRow as MaterialTableRow,
} from "@material-ui/core";
import {
  colors,
  fontFamilyPrimary,
  fontSizeBase,
  fontSizeXs,
  headingLetterSpacing,
} from "../../../assets/css-consts";
import { Button } from "../../../components/common-components";

export const Wrapper = styled.div`
  padding: 10px;
  background: ${colors.white};
`;

export const WorkerType = styled.span`
  height: 30px;
  line-height: 30px;
  max-width: 130px;
  font-size: 13px;
  border-radius: 5px;
  background-color: ${colors.nurseColor};
  padding: 4px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  text-transform: uppercase;
  
  & svg {
    margin-right: 5px;
    fill: ${colors.white};
  }  
  & svg path {
    fill: ${colors.white};
  }
  
  &.nurse-label {
    background-color: ${colors.nurseColor};
  }
  &.other-label {
    background-color: ${colors.babysitterLabelBackground};
  }
`;

export const ActionButton = styled(Button)`
  font-size: ${fontSizeXs};
  padding: 2px 25px 2px;
  visibility: hidden;
`;

export const TableContainer = styled(MaterialTableContainer)`
  padding-top: 0;
  width: 100%;
`;

export const TableRow = styled(MaterialTableRow)`
  &:nth-of-type(2n) {
    background: #f0f0f0;
  }
  &:hover ${ActionButton} {
    visibility: visible;
  }
`;

export const TableCell = styled(MaterialTableCell)`
  color: ${colors.primary};
  font-weight: normal;
  font-size: ${fontSizeBase};
  font-family: ${fontFamilyPrimary};
  letter-spacing: ${headingLetterSpacing};
  && {
    border: none;
  }
`;
