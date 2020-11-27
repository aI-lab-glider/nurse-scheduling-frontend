import React from "react";
import { Tab, withStyles } from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

interface RouteButtonsComponent {
  components: { [key: string]: React.FC };
}

const StyledTab: any = withStyles((theme) => ({
  root: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: theme.typography.pxToRem(28),
    color: "$primary-text-color",
  },
  label: {
    textTransform: "capitalize",
  },
}))((props) => <Tab disableRipple {...props} />);

export default function RouteButtonsComponent({ components }: RouteButtonsComponent): JSX.Element {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string): void => {
    setValue(newValue);
  };

  return (
    <>
      <div>
        <TabContext value={value}>
          <TabList onChange={handleChange} indicatorColor={"primary"}>
            {Object.keys(components).map((name, index) => {
              return <StyledTab key={name} label={name} value={index.toString()} />;
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
