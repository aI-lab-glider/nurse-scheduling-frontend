/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Divider, Grid, IconButton } from "@material-ui/core";
import { MdClose } from "react-icons/md";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    paper: {
      backgroundColor: "#FFFFFF",
      border: "0",
      boxShadow: "-3px 4px 20px 4px rgba(0, 0, 0, 0.15)",
      padding: theme.spacing(2, 1, 3),
      maxWidth: "600px",
      maxHeight: "350px",
      minWidth: "424px",
      minHeight: "198px",
    },
    titleMargin: {
      paddingTop: 15,
      paddingLeft: 25,
      paddingBottom: 15,
    },

    modalBody: {
      paddingTop: 25,
      position: "relative",
      overflow: "auto",
      overflowX: "hidden",
      maxHeight: "147px",
      alignItems: "center",
    },

    footer: {
      paddingTop: 15,
      position: "relative",
    },

    exitButton: {
      color: ScssVars.primary,
      marginRight: "20px",
      marginBottom: "10px",
    },
    title: {
      fontFamily: ScssVars.fontFamilyPrimary,
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.1,
      color: ScssVars.primary,
      display: "flex",
      alignItems: "center",
    },
  })
);

export interface ModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  title: string;
  body: JSX.Element;
  footer: JSX.Element;
}

export default function DefaultModal(options: ModalOptions): JSX.Element {
  const classes = useStyles();
  const { setOpen, open, title, body, footer } = options;

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid
              container
              className={classes.titleMargin}
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <h1 className={classes.title}>{title}</h1>
              </Grid>
              <Grid item>
                <IconButton className={classes.exitButton} onClick={(): void => handleClose()}>
                  <MdClose />
                </IconButton>
              </Grid>
            </Grid>

            <Divider />
            <Box className={classes.modalBody}>{body}</Box>
            <div className={classes.footer}>
              <Box>{footer}</Box>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
