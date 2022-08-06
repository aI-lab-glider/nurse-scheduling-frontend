/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { TableRow as MaterialTableRow, TableCell as MaterialTableCell } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../../../assets/css-consts";
import { Button } from "../../../components/common-components";

export const TableRow = styled(MaterialTableRow)`
  background: #f0f0f0;
`;

export const TableCell = styled(MaterialTableCell)`
  margin-top: 45px;
  color: ${colors.primary};
  padding: 0;
  && {
    font-weight: bold;
    border: none;
  }
`;

export const HeaderButton = styled(Button)`
  width: 187px;
  border: none;
`;
