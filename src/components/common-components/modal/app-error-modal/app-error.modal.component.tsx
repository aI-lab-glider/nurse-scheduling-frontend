/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import { Button } from "../../button-component/button.component";
import DefaultModal from "../modal.component";
import { LocalStorageProvider } from "../../../../api/local-storage-provider.model";
import { FileHelper } from "../../../../helpers/file.helper";

interface AppErrorModalOptions {
  onClick: () => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}

export default function AppErrorModal(options: AppErrorModalOptions): JSX.Element {
  const { setOpen, open, onClick } = options;
  const [openExtension, setIsOpenExtension] = useState(false);

  const handleClose = (): void => {
    onClick();
    setIsOpenExtension(false);
    setOpen(false);
  };

  const closeAndSaveDB = async (): Promise<void> => {
    await new LocalStorageProvider().reloadDb();
    await FileHelper.handleDbDump();
  };

  const title = "Wystąpił błąd";

  const body = (
    <div className={"span-primary error-modal-text"}>
      <p>
        Wiadomość o błędzie została wysłana do twórców.
        <br />
        Proszę odświeżyć aplikację
      </p>
    </div>
  );

  const footer = (
    <div style={{ display: "block" }}>
      <Button
        onClick={(): void => {
          window.location.reload(false);
          setIsOpenExtension(false);
          handleClose();
        }}
        size="small"
        className="submit-button"
        variant="primary"
        data-cy="btn-reload-app-error"
      >
        Odśwież aplikację
      </Button>
      <br />
      <br />
      <div className={"app-error-button error-modal-text"}>
        <a href={"#"} onClick={(): void => setIsOpenExtension(!openExtension)}>
          Dalej nie działa? Zobacz co możesz zrobić.
        </a>
      </div>
      {openExtension && (
        <>
          <div className={"span-primary error-modal-text"}>
            Aplikacja prawdopodbnie zawiera błędne dane.
            <br />
            Pobierz ostatni grafiki i wyczyść dane aplikacji.
          </div>

          <Button
            size="small"
            className="submit-button"
            variant="secondary"
            onClick={closeAndSaveDB}
          >
            Pobierz grafik i wyczyść aplikację
          </Button>
        </>
      )}
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
