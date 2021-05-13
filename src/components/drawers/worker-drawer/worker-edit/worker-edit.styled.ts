/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { Button } from "../../../common-components";

export const OptionsContainer = styled(Grid)`
  min-height: 80%;
`;

export const SubmitButton = styled(Button)`
  position: absolute;
  bottom: 74px;
  left: 23px;
`;
