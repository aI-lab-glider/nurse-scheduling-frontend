import React from "react";
import { Tab, withStyles } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/route-buttons.module.scss";

interface RouteButtonsComponent {
  components: { [key: string]: React.FC };
}

const useStyles = makeStyles(() => ({
  indicatorStyle: {
    backgroundColor: ScssVars.ic,
    height: 3,
    opacity: 1,
    outline: "none",
  },

  tabStyle: {
    opacity: 1,
    outline: "none",
  },
}));

const StyledTab: any = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: ScssVars.tc,
    outline: "none",
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: "16",
    opacity: 1,
    fontFamily: ["Roboto"].join(","),
    "&:hover": {
      color: ScssVars.ic,
      opacity: 1,
      outline: "none",
    },
    "&$selected": {
      color: ScssVars.tc,
      outline: "none",
      fontWeight: theme.typography.fontWeightBold,
    },
  },

  selected: {
    outline: "none",
  },
}))((props) => <Tab disableRipple {...props} />);

export default function RouteButtonsComponent({ components }: RouteButtonsComponent): JSX.Element {
  const [value, setValue] = React.useState("0");
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setValue(newValue);
  };

  return (
    <>
      <div>
        <TabContext value={value}>
          <TabList classes={{ indicator: classes.indicatorStyle }} onChange={handleChange}>
            {Object.keys(components).map((name, index) => {
              return (
                <StyledTab
                  className={classes.tabStyle}
                  key={name}
                  label={name}
                  value={index.toString()}
                />
              );
            })}
          </TabList>

          {Object.keys(components).map((name, index) => {
            return (
              <TabPanel key={name} value={index.toString()}>
                {React.createElement(components[name])}
              </TabPanel>
            );
          })}
        </TabContext>
      </div>
    </>
  );
}
