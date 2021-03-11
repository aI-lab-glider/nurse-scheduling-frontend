/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";

interface AppErrorModalOptions {
  onClick: () => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}

export default function AppErrorModal(options: AppErrorModalOptions): JSX.Element {
  const { setOpen, open, onClick } = options;

  const handleClose = (): void => {
    onClick();
    setOpen(false);
  };

  const title = "Coś poszło nie tak :(";

  const body = (
    <div className={"span-primary"}>
      <p>Wiadomość o błędzie została wysłana do twórców.</p>
    </div>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        onClick={handleClose}
        size="small"
        className="submit-button"
        variant="primary"
        data-cy="btn-ok-app-error"
      >
        OK
      </Button>
    </div>
  );

  return (
    <DefaultModal
      closeOptions={onClick}
      open={open}
      setOpen={setOpen}
      title={title}
      body={body}
      footer={footer}
    />
  );
}
