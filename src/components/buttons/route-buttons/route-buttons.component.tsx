/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Divider, Tab, withStyles } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
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
  const { tabs } = props;
  if (tabs.length === 0) {
    throw Error("Component cannot be called without tabs");
  }
  const [tab, setTab] = React.useState(tabs[0]!.label);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string): void => {
    setTab(newValue);
    const tabObj = _.find(tabs, (tab) => tab.label === newValue);
    if (tabObj && tabObj.onChange) {
      tabObj.onChange();
    }
  };

  // eslint-disable-next-line
  const StyledTab: any = withStyles((theme) => ({
    root: {
      textTransform: "none",
      color: props.disabled ? colors.gray100 : colors.secondaryTextColor,
      outline: "none",
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: "20",
      fontFamily: ["Roboto"].join(","),

      "&:hover": {
        color: props.disabled ? colors.gray100 : colors.primaryTextColor,
        cursor: props.disabled ? "default" : "pointer",
        opacity: 1,
        outline: "none",
      },
      "&$selected": {
        color: colors.secondaryTextColor,
        outline: "none",
        fontWeight: theme.typography.fontWeightBold,
      },
    },

    selected: {
      outline: "none",
    },
  }))((props) => <Tab disableRipple {...props} />);

  return (
    <Wrapper>
      <TabContext value={tab}>
        <HeaderWrapper>
          <TabList
            classes={{ indicator: classes.indicatorStyle }}
            onChange={!props.disabled ? handleChange : void 0}
          >
            {tabs.map((tab) => (
              <StyledTab
                className={classes.tabStyle}
                key={tab.label}
                label={tab.label}
                value={tab.label}
                data-cy={tab.dataCy}
              />
            ))}
          </TabList>
          <Divider />
        </HeaderWrapper>

        {tabs.map((tab) => (
          <TabPanel value={tab.label} key={tab.label} className={classes.tabStyle}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: 52px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
`;
