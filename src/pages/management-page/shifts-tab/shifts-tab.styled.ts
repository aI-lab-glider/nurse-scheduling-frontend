/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { fontSizeXs } from "../../../assets/colors";
import { Button } from "../../../components/common-components";

export const Wrapper = styled.div`
  margin-top: 45px;
`;

export const ActionButton = styled(Button)`
  font-size: ${fontSizeXs};
  padding: 2px 25px 2px;
`;
