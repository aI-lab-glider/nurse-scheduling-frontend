/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Button } from "../../button-component/button.component";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ScssVars from "../../../../assets/styles/styles/custom/_variables.module.scss";
import DefaultModal from "../modal.component";
import { send } from "emailjs-com";
import { useNotification } from "../../notification/notification.context";

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
      minHeight: "142px",
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

    textField: {
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight: "600px",
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
  })
);

export interface ReportIssueModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  clear?: () => void;
}

export default function ReportIssueModal(options: ReportIssueModalOptions): JSX.Element {
  const classes = useStyles();
  const [isSent, setIsSent] = useState(false);
  const { open, setOpen, clear } = options;
  const [issueDescription, setIssueDescription] = useState("");
  const title = "Zgłoś błąd";
  const { createNotification } = useNotification();

  function onIssueDescriptionChange(event): void {
    const { value } = event.target;
    setIssueDescription(value);
  }

  function handleClose(): void {
    clear && clear();
    setIssueDescription("");
    setIsSent(false);
    setOpen(false);
  }

  function handleSend(): void {
    send(
      "service_74nkmaq",
      "template_120y7az",
      {
        message: issueDescription,
      },
      process.env.REACT_APP_EMAIL_KEY
    )
      .then(() => {
        setIsSent(true);
      })
      .catch(() => {
        createNotification({ type: "error", message: "Wystąpił problem sieciowy!" });
        handleClose();
      });
  }

  // Only for testing purposes
  if (
    process.env.REACT_APP_TEST_MODE &&
    issueDescription.toLowerCase() === process.env.REACT_APP_ERROR_WORKER
  ) {
    throw new Error("[TEST MODE] Error message was entered");
  }

  const body = (
    <div className="report-issue-modal-body">
      {isSent && <p>Wysłano powiadomienie o błędzie.</p>}
      {!isSent && (
        <>
          <p>Jaki błąd wystąpił?</p>
          <TextField
            className={classes.textField}
            placeholder="Opisz błąd"
            value={issueDescription}
            onChange={onIssueDescriptionChange}
            fullWidth={true}
            multiline
            helperText={
              issueDescription.length > 19
                ? " "
                : `Treść wiadomości jest za krótka! Wprowadź jeszcze min. ${
                    19 - issueDescription.length + 1
                  } znak${
                    issueDescription.length < 16 ? `ów` : issueDescription.length < 19 ? `i` : ``
                  }.`
            }
          />
        </>
      )}
    </div>
  );

  const footer = (
    <div>
      {!isSent && (
        <>
          <Button variant="primary" onClick={handleSend} disabled={issueDescription.length < 20}>
            Wyślij
          </Button>
          <Button variant="secondary" color="secondary" onClick={handleClose}>
            Anuluj
          </Button>
        </>
      )}
      {isSent && (
        <Button variant="primary" onClick={handleClose}>
          Zamknij
        </Button>
      )}
    </div>
  );

  return (
    <DefaultModal
      open={open}
      setOpen={setOpen}
      title={title}
      body={body}
      footer={footer}
      closeOptions={handleClose}
      classNames={classes}
    />
  );
}
