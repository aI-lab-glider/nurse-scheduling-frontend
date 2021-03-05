/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { ScheduleExportLogic } from "../../../../logic/schedule-exporter/schedule-export.logic";
import { getRevisionTypeFromKey } from "../../../../api/persistance-store.model";
import xlsx from "exceljs";
import { FileHelper } from "../../../../helpers/file.helper";

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

  const onSaveButtonClick = async (): Promise<void> => {
    await FileHelper.handleDbDump();
  };

  const title = "Wystąpił błąd :(";

  const body = (
    <div className={"span-primary workers-table"}>
      <p>Wiadomość została wysłana do twórców.</p>
      <Button
        onClick={onSaveButtonClick}
        size="small"
        className="submit-button"
        variant="secondary"
      >
        Zapisz baze
      </Button>
    </div>
  );

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="secondary">
        OK
      </Button>
    </div>
  );

  return <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />;
}
