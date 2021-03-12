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
import { useSelector } from "react-redux";
import { Button } from "../..";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { ScheduleExportLogic } from "../../../../logic/schedule-exporter/schedule-export.logic";
import { ButtonData, DropdownButtons } from "../../dropdown-buttons/dropdown-buttons.component";
import DefaultModal from "../modal.component";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { cropScheduleDMToMonthDM } from "../../../../logic/schedule-container-convertion/schedule-container-convertion";

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
  const [exportMode, setexportMode] = React.useState("XLSX");
  const handleClose = (): void => {
    setOpen(false);
  };

  const [exportOptions, setExportOptions] = React.useState({
    extraWorkers: { value: true, label: "dzienni pracownicy" },
    overtime: { value: true, label: "nadgodzinny" },
  });
  const { primaryRevision } = useSelector((state: ApplicationStateModel) => state.actualState);

  const { revision } = useSelector((state: ApplicationStateModel) => state.actualState);

  const exportExtensions = {
    xlsx: (): void => {
      new ScheduleExportLogic({
        scheduleModel: cropScheduleDMToMonthDM(model),
        primaryScheduleModel: primaryRevision,
        overtimeExport: exportOptions.overtime.value,
        extraWorkersExport: exportOptions.extraWorkers.value,
      }).formatAndSave(revision);
    },
  };
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
      <Button onClick={handleExport} size="small" variant="primary" data-cy="confirm-export-button">
        Potwierdź
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
    <div style={{ paddingLeft: "15px" }}>
      <div style={{ display: "flex", msFlexDirection: "row" }}>
        <p className="label">Format pliku: </p>
        <div style={{ top: "50%", marginTop: "-15px" }}>
          <DropdownButtons
            buttons={btnData}
            mainLabel={exportMode}
            buttonVariant="secondary"
            variant="extension"
          />
        </div>
      </div>
      <div>
        <p className="label">Opcje pliku: </p>
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
      <DefaultModal
        width={500}
        open={open}
        setOpen={setOpen}
        title={title}
        body={body}
        footer={footer}
      />
    </div>
  );
}
