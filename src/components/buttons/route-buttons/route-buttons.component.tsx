/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Divider } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import _ from "lodash";
import * as S from "./route-buttons.styled";

export interface Tabs {
  label: string;
  component: JSX.Element;
  dataCy: string;
  onChange?: () => void;
}

interface RouteButtonsOptions {
  tabs: Tabs[];
  disabled?: boolean;
}

export default function RouteButtonsComponent(props: RouteButtonsOptions): JSX.Element {
  const { tabs, disabled } = props;
  if (tabs.length === 0) {
    throw Error("Component cannot be called without tabs");
  }
  const [tab, setTab] = React.useState(tabs[0]!.label);
  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string): void => {
    setTab(newValue);
    const tabObj = _.find(tabs, (tab) => tab.label === newValue);
    if (tabObj && tabObj.onChange) {
      tabObj.onChange();
    }
  };

  return (
    <S.Wrapper>
      <TabContext value={tab}>
        <S.HeaderWrapper>
          <S.TabList onChange={!disabled ? handleChange : void 0}>
            {tabs.map((tab) => (
              <S.Tab
                disableRipple
                key={tab.label}
                label={tab.label}
                value={tab.label}
                data-cy={tab.dataCy}
                disabled={disabled}
              />
            ))}
          </S.TabList>
          <Divider />
        </S.HeaderWrapper>

        {tabs.map((tab) => (
          <S.TabPanel value={tab.label} key={tab.label}>
            {tab.component}
          </S.TabPanel>
        ))}
      </TabContext>
    </S.Wrapper>
  );
}
