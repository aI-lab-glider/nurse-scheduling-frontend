/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { t } from "../../../helpers/translations.helper";
import { WorkerInfoModel } from "../../../state/schedule-data/worker-info/worker-info.model";
import { WorkerActionCreator } from "../../../state/schedule-data/worker-info/worker.action-creator";
import { Button } from "../../buttons/button-component/button.component";
import DefaultModal, { modalFooterButtonMarginString } from "../modal.component";

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

  const title = t("confirmAction");

  const body = <Message>{t("removeEmployeeQuestion", { name: worker?.name })}?</Message>;

  const footer = (
    <>
      <Button
        onClick={handleClose}
        size="small"
        className="submit-button"
        variant="secondary"
        marginString={modalFooterButtonMarginString}
      >
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
        marginString={modalFooterButtonMarginString}
      >
        {t("confirm")}
      </Button>
    </>
  );
  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
const Message = styled.div`
  margin-bottom: 0;
`;
