/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { colors } from "../../../assets/css-consts";
import { Button } from "../../common-components";

export const Title = styled.h3`
  color: ${colors.errorRed};
`;

export const ErrorLoadingText = styled.div`
  display: block;
  margin: auto;
  text-align: center;
  font-weight: 500;
  size: 16px;
  line-height: 28px;
  color: ${colors.primary};
  clear: both;
  position: relative;
  top: 27px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ErrorButton = styled(Button)`
  display: block;
  margin: auto;
  position: relative;
  top: 41px;
`;

export const Image = styled.img`
  display: block;
  margin: auto;
  width: 55px;
  height: 49px;
`;
