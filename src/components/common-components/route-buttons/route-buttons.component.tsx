/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Divider, Tab, withStyles } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_route-buttons.module.scss";
import _ from "lodash";

export interface Tabs {
  label: string;
  component: JSX.Element;
  dataCy: string;
  onChange?: () => void;
}

interface RouteButtonsOptions {
  tabs: Tabs[];
  disabled?: boolean;
  id?: string;
}

const useStyles = makeStyles(() => ({
  indicatorStyle: {
    backgroundColor: ScssVars.indicatorColor,
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
  const tabs = props.tabs;
  const id = "" + props.id;
  const [tab, setTab] = React.useState(tabs[0].label);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
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
      color: props.disabled ? ScssVars.disabledTextColor : ScssVars.routeTextColor,
      outline: "none",
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: "20",
      fontFamily: ["Roboto"].join(","),

      "&:hover": {
        color: props.disabled ? ScssVars.disabledTextColor : ScssVars.indicatorColor,
        cursor: props.disabled ? "default" : "pointer",
        opacity: 1,
        outline: "none",
      },
      "&$selected": {
        color: ScssVars.routeTextColor,
        outline: "none",
        fontWeight: theme.typography.fontWeightBold,
      },
    },

    selected: {
      outline: "none",
    },
  }))((props) => <Tab disableRipple {...props} />);

  return (
    <div className={"tabs-and-buttons"}>
      <TabContext value={tab}>
        <div className={"tabs-row"} id={id}>
          <div className={"tabs-and-buttons"}>
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
          </div>
        </div>

        {tabs.map((tab) => (
          <TabPanel value={tab.label} key={tab.label} className={classes.tabStyle}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
}
