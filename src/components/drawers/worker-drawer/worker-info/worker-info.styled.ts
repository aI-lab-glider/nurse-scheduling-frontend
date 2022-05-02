/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { Divider } from "@material-ui/core";
import { fontSizeBase, fontSizeLg } from "../../../../assets/css-consts";
import { Button } from "../../../common-components";

export const WorkerNameLabel = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;

export const WorkerTypeLabel = styled.p`
  border-radius: 20px;
  letter-spacing: 0.025em;
  background-color: ${({ color }): string | undefined => color};
  padding: 6px;
  width: 100px;
  text-align: center;
`;
export const BoldInfo = styled.p`
  font-weight: bold;
  margin-left: 10px;
`;
export const OvertimeHours = styled(BoldInfo)`
  color: #c60053;
`;
export const CalendarDivider = styled(Divider)`
  margin: 20px 0;
`;

export const WorkerInfo = styled.p`
  margin-bottom: 0;
  flex-direction: row;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 10px;
  display: flex;
`;

export const ShiftsLabel = styled.h3`
  font-size: ${fontSizeBase};
  font-weight: 700;
`;

export const DownloadButton = styled(Button)`
  float: right;
`;

export const WorkerInfoContainer = styled.div`
  width: 750px;
`;

export const HeaderRow = styled.div`
  margin-top: 42px;
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
export const NameLabelRow = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: row;
`;
