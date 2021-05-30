/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { colors } from "../../../assets/colors";

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

const useStyles = makeStyles(() => ({
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
    outline: "none",
  },
  tabStyle: {
    minWidth: 0,
    outline: "none",
    margin: "0 20px 0 0",
    padding: 0,
  },
}));

export default function RouteButtonsComponent(props: RouteButtonsOptions): JSX.Element {
  const { tabs, disabled } = props;
  if (tabs.length === 0) {
    throw Error("Component cannot be called without tabs");
  }
  const [tab, setTab] = React.useState(tabs[0]!.label);

  const classes = useStyles();

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, newValue: string): void => {
      if (disabled) {
        return;
      }
      setTab(newValue);
      const tabObj = _.find(tabs, (tab) => tab.label === newValue);
      if (tabObj && tabObj.onChange) {
        tabObj.onChange();
      }
    },
    [disabled, setTab, tabs]
  );

  const tabListClasses = useMemo(() => ({ indicator: classes.indicatorStyle }), [
    classes.indicatorStyle,
  ]);

  const tabTitles = useMemo(
    () =>
      tabs.map((tab) => (
        <StyledTab
          disableRipple
          disabled={disabled}
          className={classes.tabStyle}
          key={tab.label}
          label={tab.label}
          value={tab.label}
          data-cy={tab.dataCy}
        />
      )),
    [tabs, classes.tabStyle, disabled]
  );

  const tabContents = useMemo(
    () =>
      tabs.map((tab) => (
        <TabPanel value={tab.label} key={tab.label} className={classes.tabStyle}>
          {tab.component}
        </TabPanel>
      )),
    [tabs, classes.tabStyle]
  );

  return (
    <Wrapper>
      <TabContext value={tab}>
        <HeaderWrapper>
          <TabList classes={tabListClasses} onChange={handleChange}>
            {tabTitles}
          </TabList>
          <Divider />
        </HeaderWrapper>
        {tabContents}
      </TabContext>
    </Wrapper>
  );
}

const StyledTab = styled(Tab)`
  &&& {
    outline: none;
    text-transform: none;
    color: ${({ disabled }) => (disabled ? colors.gray100 : colors.secondaryTextColor)};
    font-size: 20;
    font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
    font-family: Roboto;

    &:hover {
      color: ${({ disabled }) => (disabled ? colors.gray100 : colors.primaryTextColor)};
      cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
      opacity: 1;
      outline: none;
    }
  }
`;

const Wrapper = styled.div`
  width: 100%;
  margin-top: 52px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
`;
