/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { colors, fontSizeBase, fontWeightBold } from "../../../assets/css-consts";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  position: absolute;
  padding: 80px;
  border-radius: 10px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
`;

export const Image = styled.img`
  height: 270px;
`;

export const Message = styled.pre`
  color: ${colors.primary};
  font-weight: ${fontWeightBold};
  font-size: ${fontSizeBase};
  margin-top: 1rem;
  margin-bottom: 2rem;
`;
