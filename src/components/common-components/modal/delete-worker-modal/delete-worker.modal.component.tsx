import React from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";
import { WorkerInfoModel } from "../../../../common-models/worker-info.model";

interface DeleteWorkerModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  worker?: WorkerInfoModel;
}

export default function DeleteWorkerModalComponent(options: DeleteWorkerModalOptions): JSX.Element {
  const { setOpen, open, worker } = options;

  const handleClose = (): void => {
    setOpen(false);
  };

  const title = "Potwierdź akcję";

  const body = (
    <div className={"span-errors workers-table"}>
      <p>Czy naprawde chcesz usunąć pracownika {worker?.name} ?</p>
    </div>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="secondary">
        Anuluj
      </Button>
      <Button onClick={handleClose} size="small" className="submit-button" variant="primary">
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
