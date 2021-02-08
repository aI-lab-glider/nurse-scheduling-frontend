import React, { useEffect, useState } from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";
import { WorkerInfoModel } from "../../../../common-models/worker-info.model";

interface DeleteUserModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  worker: WorkerInfoModel;
}

export default function DeleteUserModalComponent(options: DeleteUserModalOptions): JSX.Element {
  const { setOpen, open, worker } = options;

  const handleClose = (): void => {
    setOpen(false);
  };

  const title = "Czy naprawde chcesz usunąć użytkownika " + worker.name + "?";

  const body = (
    <>
      <p>Imie</p>
      <br />
      <p>Nazwisko</p>
      <br />
      <p>Stanowisko</p>
    </>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="primary">
        OK
      </Button>
    </div>
  );
  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
