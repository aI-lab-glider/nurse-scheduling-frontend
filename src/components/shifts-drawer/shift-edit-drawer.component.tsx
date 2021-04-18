/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import { Shift } from "../../state/schedule-data/shifts-types/shift-types.model";
import { AcronymGenerator } from "../../helpers/acronym-generator.helper";
import { DropdownColors } from "../buttons/dropdown-buttons/dropdown-colors.component";
import { Button } from "../common-components";
import { ShiftDrawerMode } from "./shift-drawer.component";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/application-state.model";
import i18next from "i18next";
import { t } from "../../helpers/translations.helper";

interface ShiftEditDrawerOptions {
  selectedShift: Shift;
  saveChangedShift: (Shift) => void;
  mode: ShiftDrawerMode;
}

export default function ShiftEditDrawer({
  selectedShift,
  saveChangedShift,
  mode,
}: ShiftEditDrawerOptions): JSX.Element {
  const shifts = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );
  const shiftNames = Object.values(shifts).map((shift) => shift.name);
  const shiftCodes = Object.values(shifts).map((shift) => shift.code);
  const [shiftName, setShiftName] = useState(selectedShift.name);
  const [shiftCode, setShiftCode] = useState(selectedShift.code);

  const [isInShiftNames, checkShiftName] = useState(false);
  const [isInShiftCodes, checkShiftCode] = useState(false);
  const [isCodeManuallyChanged, setCodeManuallyChanged] = useState(false);

  const shiftNameTextFieldOnChange = (shiftNameActual: string): void => {
    setShiftName(shiftNameActual);
    !isCodeManuallyChanged && setShiftCode(AcronymGenerator.generate(shiftNameActual, shifts));
    checkShiftName(shiftNames.includes(shiftNameActual));
  };

  const [shiftType, setShiftType] = useState(
    selectedShift.isWorkingShift ? "working" : "not_working"
  );

  function getButtonLabel(mode: ShiftDrawerMode): string {
    switch (mode) {
      case ShiftDrawerMode.EDIT:
        return i18next.t("shiftEdit");
      case ShiftDrawerMode.ADD_NEW:
        return i18next.t("shiftAdd");
    }
  }

  function changeShiftType(newShiftType: string): void {
    setShiftType(newShiftType);

    onChangeTimeStart(getNewDate());
    onChangeTimeEnd(getNewDate());

    if (newShiftType === "working") {
      setPicked("FFD100");
    } else {
      setPicked("FF8A00");
    }
  }

  function getNewDate(dateType?: string): Date {
    const newDate = new Date();
    switch (dateType) {
      case "start":
        newDate.setHours(selectedShift.from, 0, 0, 0);
        break;
      case "end":
        newDate.setHours(selectedShift.to, 0, 0, 0);
        break;
      default:
        newDate.setHours(0, 0, 0, 0);
        break;
    }

    return newDate;
  }
  const [valueTimeStart, onChangeTimeStart] = useState<Date | null>(getNewDate("start"));
  const [valueTimeEnd, onChangeTimeEnd] = useState<Date | null>(getNewDate("end"));

  const [colorPicked, setPicked] = useState(selectedShift.color);

  return (
    <Grid container className="edit-field" direction="column" justify="space-between">
      <Grid item>
        <h4>{t("shiftName")}</h4>
        <TextField
          type="text"
          placeholder={selectedShift.name}
          onChange={(event): void => shiftNameTextFieldOnChange(event.target.value)}
          helperText={isInShiftNames ? t("shiftAlreadyExists") : ""}
          error={isInShiftNames}
        />

        <br />

        <h4>{t("shiftType")}</h4>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="shiftType"
            name="shiftType"
            value={shiftType}
            onChange={(event): void => changeShiftType(event.target.value)}
          >
            <FormControlLabel value="working" control={<Radio />} label={t("workingShift")} />
            <FormControlLabel
              value="not_working"
              control={<Radio />}
              label={t("notWorkingShift")}
            />
          </RadioGroup>
        </FormControl>
        <br />

        <h4>{t("shiftHours")}</h4>
        <div className={"time-range"}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              disabled={shiftType === "not_working"}
              label=""
              placeholder="00:00"
              ampm={false}
              value={valueTimeStart}
              onChange={onChangeTimeStart}
              openTo={"hours"}
              views={["hours"]}
            />
            <p>&ndash;</p>
            <TimePicker
              disabled={shiftType === "not_working"}
              label=""
              placeholder="00:00"
              ampm={false}
              value={valueTimeEnd}
              onChange={onChangeTimeEnd}
              openTo={"hours"}
              views={["hours"]}
            />
          </MuiPickersUtilsProvider>
        </div>
        <br />

        <h4>{t("shiftShort")}</h4>
        <TextField
          type="text"
          placeholder="Skrót"
          value={shiftCode}
          onChange={(event): void => {
            setShiftCode(event.target.value);
            checkShiftCode(shiftCodes.includes(event.target.value));
            setCodeManuallyChanged(true);
          }}
          helperText={isInShiftCodes ? t("shiftWithThatColorExist") : ""}
          error={isInShiftCodes}
        />
        <br />

        <h4>{t("shiftColor")}</h4>

        <DropdownColors
          shiftType={shiftType}
          mainLabel={t("selectColor")}
          buttonVariant="secondary"
          colorClicker={setPicked}
          selectedColor={colorPicked}
          width={200}
        />
      </Grid>
      <Grid item>
        <Button
          variant="primary"
          onClick={(): void => {
            saveChangedShift({
              code: shiftCode,
              name: shiftName,
              from: valueTimeStart?.getHours() ?? 0,
              to: valueTimeEnd?.getHours() ?? 0,
              color: colorPicked,
              isWorkingShift: shiftType === "working",
            });
          }}
        >
          {getButtonLabel(mode)}
        </Button>
      </Grid>
    </Grid>
  );
}
