/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { EmptyMonthButtons } from "../../../components/buttons/empty-month-buttons/empty-month-buttons";
import nurse from "../../../assets/images/nurse.png";
import styled from "styled-components";
import { colors, fontSizeBase, fontWeightBold } from "../../../assets/colors";

export function NewScheduleComponent(): JSX.Element {
  return (
    <Wrapper>
      <Image src={nurse} alt="" />
      <Message>Nie masz planu na ten miesiąc</Message>
      <EmptyMonthButtons />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh;
`;

const Image = styled.img`
  height: 270px;
`;

const Message = styled.pre`
  color: ${colors.primary};
  font-weight: ${fontWeightBold};
  font-size: ${fontSizeBase};
  margin-top: 1rem;
`;
