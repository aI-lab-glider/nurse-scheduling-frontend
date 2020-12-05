import React from "react";
import { Divider, Tab, withStyles } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/route-buttons.module.scss";

interface Tabs {
  label: string;
  component: JSX.Element;
  rightSideButtons?: JSX.Element;
}

const useStyles = makeStyles(() => ({
  indicatorStyle: {
    backgroundColor: ScssVars.indicatorColor,
    height: 3,
    opacity: 1,
    outline: "none",
  },

  tabStyle: {
    opacity: 1,
    outline: "none",
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledTab: any = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: ScssVars.routeTextColor,
    outline: "none",
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: "16",
    opacity: 1,
    fontFamily: ["Roboto"].join(","),
    "&:hover": {
      color: ScssVars.indicatorColor,
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

export default function RouteButtonsComponent({ tabs }: { tabs: Tabs[] }): JSX.Element {
  const [tab, setTab] = React.useState(tabs[0].label);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setTab(newValue);
  };

  return (
    <div className={"tabs-and-buttons"}>
      <TabContext value={tab}>
        <div className={"tabs-row"}>
          <div className={"tabs-and-buttons"}>
            <TabList classes={{ indicator: classes.indicatorStyle }} onChange={handleChange}>
              {tabs.map((tab) => (
                <StyledTab
                  className={classes.tabStyle}
                  key={tab.label}
                  label={tab.label}
                  value={tab.label}
                />
              ))}
            </TabList>
            <Divider />
          </div>
          <div className="filler" />
          {tabs.map((tab) => (
            <TabPanel value={tab.label} key={tab.label}>
              {tab.rightSideButtons}
            </TabPanel>
          ))}
        </div>

        {tabs.map((tab) => (
          <TabPanel value={tab.label} key={tab.label}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
}
