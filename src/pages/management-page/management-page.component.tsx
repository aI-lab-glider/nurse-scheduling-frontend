/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import * as S from "./management-page.styled";
import RouteButtonsComponent, {
  Tabs,
} from "../../components/buttons/route-buttons/route-buttons.component.old";
import ShiftTab from "./shifts-tab/shifts-tab.component";
import WorkersTab from "./workers-tab/workers-tab.component";

export default function ManagementPage(): JSX.Element {
  const tabs: Tabs[] = [
    { label: "Pracownicy", component: <WorkersTab />, dataCy: "btn-workers-tab" },
    { label: "Zmiany", component: <ShiftTab />, dataCy: "btn-shifts-tab" },
  ];
  return (
    <S.Wrapper>
      <RouteButtonsComponent tabs={tabs} />
    </S.Wrapper>
  );
}
