/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Button } from "../../buttons/button-component/button.component";
import DefaultModal from "../modal.component";
import { WorkerInfoModel } from "../../../state/schedule-data/worker-info/worker-info.model";
import { useDispatch } from "react-redux";
import { WorkerActionCreator } from "../../../state/schedule-data/worker-info/worker.action-creator";
import { useTranslation } from "react-i18next";

interface DeleteWorkerModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  worker?: WorkerInfoModel;
}

export default function DeleteWorkerModalComponent(options: DeleteWorkerModalOptions): JSX.Element {
  const dispatcher = useDispatch();
  const { t } = useTranslation();

  const { setOpen, open, worker } = options;

  const handleClose = (): void => {
    setOpen(false);
  };

  const title = t("confirmAction");

  const body = (
    <div className={"span-primary workers-table"}>
      <p>
        {t("doYouReallyWantToRemoveAnEmployee")} {worker?.name} ?
      </p>
    </div>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="secondary">
        {t("cancel")}
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
        {t("confirm")}
      </Button>
    </div>
  );
  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
