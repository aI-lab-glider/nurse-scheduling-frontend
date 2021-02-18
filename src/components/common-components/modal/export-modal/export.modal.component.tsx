/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
  withStyles,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React from "react";
import { Button } from "../..";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { ScheduleExportLogic } from "../../../../logic/schedule-exporter/schedule-export.logic";
import { ButtonData, DropdownButtons } from "../../dropdown-buttons/dropdown-buttons.component";
import DefaultModal from "../modal.component";

export interface ExportModalComponent {
  setOpen: (open: boolean) => void;
  open: boolean;
  model: ScheduleDataModel;
}
const BlueCheckBox = withStyles({
  root: {
    color: blue[400],
    "&$checked": {
      color: blue[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default function ExportModal(options: ExportModalComponent): JSX.Element {
  const { setOpen, open, model } = options;
  const [exportMode, setexportMode] = React.useState("XSLX");
  const handleClose = (): void => {
    setOpen(false);
  };
  const DEFAULT_FILENAME = "grafik.xlsx";
  const exportExtensions = {
    xslx: (): void => {
      new ScheduleExportLogic(model).formatAndSave(DEFAULT_FILENAME);
    },
  };
  const [exportOptions, setExportOptions] = React.useState({
    extraWorkers: { value: false, label: "dzienni pracownicy" },
    overtime: { value: false, label: "nadgodzinny" },
    gray: { value: false, label: "bez koloru" },
  });

  const handleExport = (): void => {
    exportExtensions[exportMode.toLowerCase()]();
    setOpen(false);
  };

  const btnData: ButtonData[] = [];
  for (const key of Object.keys(exportExtensions)) {
    const button: ButtonData = {
      label: key.toUpperCase(),
      action: () => setexportMode(key.toUpperCase()),
    };
    btnData.push(button);
  }

  const title = "Pobierz plan";

  const footer = (
    <div>
      <Button onClick={handleExport} size="small" variant="primary">
        Potwierdż
      </Button>
      <Button onClick={handleClose} size="small" variant="secondary">
        Anuluj
      </Button>
    </div>
  );
  const handleChange = (event): void => {
    setExportOptions({
      ...exportOptions,
      [event.target.name]: {
        value: event.target.checked,
        label: exportOptions[event.target.name].label,
      },
    });
  };

  const body = (
    <div>
      <div style={{ display: "flex", msFlexDirection: "row" }}>
        <p className="makeStyles-title-22">Format pliku: </p>
        <DropdownButtons
          buttons={btnData}
          mainLabel={exportMode}
          buttonVariant="secondary"
          variant="extension"
        />
      </div>
      <div>
        <p className="makeStyles-title-22">Opcje pliku: </p>
        <FormGroup row>
          {Object.keys(exportOptions).map((key) => (
            <FormControlLabel
              style={{ color: "black" }}
              control={
                <BlueCheckBox
                  checked={exportOptions[key].value}
                  onChange={handleChange}
                  name={key}
                />
              }
              label={exportOptions[key].label}
            />
          ))}
        </FormGroup>
      </div>
    </div>
  );

  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
