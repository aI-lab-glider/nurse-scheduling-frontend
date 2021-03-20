/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ScssVars from "../../../../assets/styles/styles/custom/_variables.module.scss";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { ScheduleDataActionCreator } from "../../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";

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

export interface SaveChangesModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  handleSave: () => void;
  closeOptions: () => void;
}

export default function SaveChangesModal(options: SaveChangesModalOptions): JSX.Element {
  const classes = useStyles();
  const { open, setOpen, handleSave, closeOptions } = options;
  const title = "Niezapisane zmiany w grafiku";
  const { persistentSchedule } = useSelector((state: ApplicationStateModel) => state.actualState);
  const persistent = persistentSchedule.present;

  const dispatch = useDispatch();
  const fetchPrevScheduleVersion = (): void => {
    dispatch(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(persistent));
  };

  function handleClose(): void {
    setOpen(false);
    closeOptions();
  }

  function onSaveClick(): void {
    handleSave();
    handleClose();
  }

  function onNoSaveClick(): void {
    fetchPrevScheduleVersion();
    handleClose();
  }

  const body = (
    <div className="save-changes-modal-body">
      <p>Czy chcesz zapisać wprowadzone zmiany?</p>
    </div>
  );

  const footer = (
    <div className="save-changes-modal-footer">
      <Link to="/">
        <Button variant="primary" onClick={onSaveClick}>
          Tak
        </Button>
      </Link>

      <Link to="/">
        <Button variant="secondary" color="secondary" onClick={onNoSaveClick}>
          Nie
        </Button>
      </Link>
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
