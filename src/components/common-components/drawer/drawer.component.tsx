import {
  Box,
  Divider,
  Drawer as MaterialDrawer,
  DrawerProps,
  Grid,
  IconButton,
} from "@material-ui/core";
import { MdClose } from "react-icons/md";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles({
  drawer: {
    minWidth: 500,
  },
  drawerContentMargin: {
    paddingTop: 25,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 15,
  },
  exitButton: {
    margin: "-7px -8px",
    marginTop: -15,
    color: ScssVars.primary,
  },
  title: {
    fontFamily: ScssVars.fontFamilyPrimary,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.1,
    color: ScssVars.primary,
  },
});

export interface DrawerOptions extends DrawerProps {
  title: string;
  setOpen: (open: boolean) => void;
}

export default function Drawer(options: DrawerOptions): JSX.Element {
  const classes = useStyles();
  const { title, setOpen, children, ...otherOptions } = options;

  return (
    <MaterialDrawer classes={{ paper: classes.drawer }} {...otherOptions} anchor={"right"}>
      <Grid
        container
        className={classes.drawerContentMargin}
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <h1 className={classes.title}>{title}</h1>
        </Grid>
        <Grid item>
          <IconButton className={classes.exitButton} onClick={(): void => setOpen(false)}>
            <MdClose />
          </IconButton>
        </Grid>
      </Grid>

      <Divider />

      <Box className={classes.drawerContentMargin}>{children}</Box>
    </MaterialDrawer>
  );
}
