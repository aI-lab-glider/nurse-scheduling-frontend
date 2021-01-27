/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";

export interface ReportIssueModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
}

export default function ReportIssueModal(options: ReportIssueModalOptions): JSX.Element {
  function onIssueDescriptionChange(event): void {
    const { value } = event.target;
    setIssueDescription(value);
  }

  const { open, setOpen } = options;
  const [issueDescription, setIssueDescription] = useState("");
  const title = "Zgłoś błąd";
  const body = (
    <div>
      <Typography color="textPrimary">Jaki błąd wystąpił?</Typography>
      <TextField
        placeholder="Opisz błąd"
        value={issueDescription}
        onChange={onIssueDescriptionChange}
        color="primary"
      />
    </div>
  );
  const footer = (
    <div>
      <Button variant="primary">Wyślij</Button>
      <Button variant="outlined" color="secondary">
        Anuluj
      </Button>
    </div>
  );

  return <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />;
}
