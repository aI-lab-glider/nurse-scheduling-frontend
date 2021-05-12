/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import * as S from "./styled";
import { colors } from "../../assets/colors";
import RouteButtonsComponent, {
  Tabs,
} from "../../components/buttons/route-buttons/route-buttons.component";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";

export default function ManagementPage(): JSX.Element {
  const tabs: Tabs[] = [
    { label: "PRACOWNICY", component: <WorkersTab />, dataCy: "btn-workers-tab" },
    { label: "ZMIANY", component: <ShiftTab />, dataCy: "btn-shifts-tab" },
  ];
  return (
    <Wrapper>
      <Title data-cy="management-page-title">Panel zarządzania</Title>
      <RouteButtonsComponent tabs={tabs} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow: auto;
  width: 100%;
  padding: 20px;
  min-height: 100vh;
`;
const Title = styled.h1`
  color: ${colors.primaryTextColor};
  margin: 0 10px 10px 10px;
`;
