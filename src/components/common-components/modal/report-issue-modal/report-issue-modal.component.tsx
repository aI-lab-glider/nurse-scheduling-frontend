/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Button } from "../../button-component/button.component";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Divider, Grid, IconButton } from "@material-ui/core";
import { MdClose } from "react-icons/md";
import ScssVars from "../../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames";

const useStyles = makeStyles(() =>
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
      width: "483px",
      minHeight: "442px",
    },

    modalBody: {
      position: "relative",
      overflow: "auto",
      overflowX: "hidden",
      width: "100%",
      height: "auto",
      alignItems: "center",
      color: ScssVars.primary,
      fontFamily: ScssVars.fontFamilyPrimary,
      fontSize: 16,
      lineHeight: 0,
      padding: "15px 27px 23px 27px",
    },

    titleMargin: {
      margin: "9.6px 24px 0px 24px",
    },

    footer: {
      paddingBottom: "24px",
      paddingLeft: "14px",
    },

    exitButton: {
      color: ScssVars.primary,
      marginRight: "30px",
      marginBottom: "10px",
    },

    title: {
      fontFamily: ScssVars.fontFamilyPrimary,
      fontWeight: 700,
      fontSize: 18,
      color: ScssVars.primary,
      display: "flex",
    },

    spinnerScaled: {
      marginTop: "88px",
      marginBottom: "84px",
      height: "100px",
      width: "100px",
    },
  })
);

export interface ReportIssueModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  screenshot?;
  clear: () => void;
}

export default function ReportIssueModal(options: ReportIssueModalOptions): JSX.Element {
  function onIssueDescriptionChange(event): void {
    const { value } = event.target;
    setIssueDescription(value);
  }

  function handleClose(): void {
    clear();
    setOpen(false);
  }

  const classes = useStyles();
  const { open, setOpen, screenshot, clear } = options;
  const [issueDescription, setIssueDescription] = useState("");
  const title = "Zgłoś błąd";
  const body = (
    <div className="report-issue-modal-body">
      {screenshot && (
        <>
          <img src={screenshot} height="200px" alt="Zrzut ekranu" />
          <p>Jaki błąd wystąpił?</p>
          <TextField
            placeholder="Opisz błąd"
            value={issueDescription}
            onChange={onIssueDescriptionChange}
            fullWidth={true}
            multiline
          />
        </>
      )}
      {!screenshot && <div className={classNames("spinner", classes.spinnerScaled)} />}
    </div>
  );
  const footer = (
    <div>
      <Button variant="primary" onClick={handleClose}>
        Wyślij
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleClose}>
        Anuluj
      </Button>
    </div>
  );

  return (
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
  );
}
