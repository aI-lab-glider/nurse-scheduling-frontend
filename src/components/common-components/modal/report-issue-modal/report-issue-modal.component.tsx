/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";

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

  function close(): void {
    clear();
    setOpen(false);
  }

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
          />
        </>
      )}
      {!screenshot && <div className="spinner spinner-scaled" />}
    </div>
  );
  const footer = (
    <div>
      <Button variant="primary" onClick={close}>
        Wyślij
      </Button>
      <Button variant="outlined" color="secondary" onClick={close}>
        Anuluj
      </Button>
    </div>
  );

  return (
    <DefaultModal
      open={open}
      setOpen={setOpen}
      title={title}
      body={body}
      footer={footer}
      closeOptions={clear}
    />
  );
}
