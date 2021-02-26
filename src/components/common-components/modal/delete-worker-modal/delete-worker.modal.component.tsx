/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";
import { WorkerInfoModel } from "../../../../common-models/worker-info.model";
import { useDispatch } from "react-redux";
import { WorkerActionCreator } from "../../../../state/reducers/worker.action-creator";

interface DeleteWorkerModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  worker?: WorkerInfoModel;
}

export default function DeleteWorkerModalComponent(options: DeleteWorkerModalOptions): JSX.Element {
  const dispatcher = useDispatch();

  const { setOpen, open, worker } = options;

  const handleClose = (): void => {
    setOpen(false);
  };

  const title = "Potwierdź akcję";

  const body = (
    <div className={"span-primary workers-table"}>
      <p>Czy naprawde chcesz usunąć pracownika {worker?.name} ?</p>
    </div>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="secondary">
        Anuluj
      </Button>
      <Button
        onClick={(): void => {
          dispatcher(WorkerActionCreator.deleteWorker(worker));
          handleClose();
        }}
        size="small"
        className="submit-button"
        variant="primary"
      >
        Zaakceptuj
      </Button>
    </div>
  );
  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
