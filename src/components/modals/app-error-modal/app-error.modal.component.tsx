/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useState, useEffect } from "react";
import { FileHelper } from "../../../helpers/file.helper";
import { LocalStorageProvider } from "../../../logic/data-access/local-storage-provider.model";
import { Button } from "../../common-components";
import DefaultModal from "../modal.component";


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

  useEffect(() => {
    setIsOpenExtension(false);
  }, [open]);

  const closeAndSaveDB = async (): Promise<void> => {
    await FileHelper.handleDbDump();
    await new LocalStorageProvider().reloadDb();
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
        <p
          className={openExtension ? "clicked" : "not-clicked"}
          onClick={(): void => setIsOpenExtension(true)}
        >
          Dalej nie działa? Zobacz co możesz zrobić.
        </p>
      </div>
      {openExtension && (
        <>
          <div className={"span-primary error-modal-text"}>
            Aplikacja prawdopodbnie zawiera błędne dane.
            <br />
            Pobierz wszystkie grafiki i wyczyść dane aplikacji.
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
