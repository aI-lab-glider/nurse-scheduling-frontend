/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ButtonData,
  DropdownButtons,
} from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import ExportModal from "../../common-components/modal/export-modal/export.modal.component";
import { useImportModal } from "./import-modal-context";

export function ImportButtonsComponent(): JSX.Element {
  const { handleImport } = useImportModal();
  const fileUpload = useRef<HTMLInputElement>(null);

  const stateScheduleModel = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule?.present
  );

  const btnData1: ButtonData = {
    label: "Wczytaj",
    action: () => fileUpload.current?.click(),
    dataCy: "load-schedule-button",
  };
  const btnData2: ButtonData = {
    label: "Zapisz jako...",
    action: (): void => handleExport(),
    dataCy: "export-schedule-button",
  };

  const btnData = [btnData1, btnData2];

  function handleExport(): void {
    if (stateScheduleModel) {
      setExportModalOpen(true);
    }
  }

  const [exportModalOpen, setExportModalOpen] = React.useState(false);

  return (
    <div>
      <DropdownButtons
        buttons={btnData}
        mainLabel="Plik"
        buttonVariant="primary"
        variant="file-dropdown"
        dataCy={"file-dropdown"}
      />
      <input
        ref={fileUpload}
        id="file-input"
        data-cy="file-input"
        onChange={(event): void => handleImport(event)}
        style={{ display: "none" }}
        type="file"
        accept=".xlsx"
      />
      <ExportModal open={exportModalOpen} setOpen={setExportModalOpen} model={stateScheduleModel} />
    </div>
  );
}
