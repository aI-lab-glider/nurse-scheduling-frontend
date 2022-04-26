/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import {headerHeight} from "../../assets/css-consts";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${headerHeight};
  padding: 0 10px;
  width: 100%;
  align-items: center;
  min-height: 100vh;
`;
