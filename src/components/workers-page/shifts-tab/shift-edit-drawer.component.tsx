import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { Shift, shifts } from "../../../common-models/shift-info.model";
import { AcronymGenerator } from "../../../helpers/acronym-generator.helper";
import { DropdownColors } from "../../common-components/dropdown-buttons/dropdown-colors.component";
import classNames from "classnames/bind";
import { Button } from "../../common-components";

interface ShiftEditDrawerOptions {
  selectedShift: Shift;
  saveChangedShift: (Shift) => void;
}

export default function ShiftEditDrawer({
  selectedShift,
  saveChangedShift,
}: ShiftEditDrawerOptions): JSX.Element {
  const shiftNames = Object.values(shifts).map((shift) => shift.name);
  const shiftCodes = Object.values(shifts).map((shift) => shift.code);
  const [shiftName, setShiftName] = useState(selectedShift.name);
  const [shiftCode, setShiftCode] = useState(selectedShift.code);

  const [isInShiftNames, checkShiftName] = useState(false);
  const [isInShiftCodes, checkShiftCode] = useState(false);
  const [isCodeManuallyChanged, setCodeManuallyChanged] = useState(false);

  const shiftNameTextFieldOnChange = (shiftNameActual: string): void => {
    setShiftName(shiftNameActual);
    !isCodeManuallyChanged && setShiftCode(AcronymGenerator.generate(shiftNameActual));
    checkShiftName(shiftNames.includes(shiftNameActual));
  };

  const [shiftType, setShiftType] = useState(
    selectedShift.isWorkingShift ? "working" : "not_working"
  );

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
    <>
      <div className={"edit-field"}>
        <h4>Nazwa zmiany</h4>
        <TextField
          type="text"
          placeholder={selectedShift.name}
          onChange={(event): void => shiftNameTextFieldOnChange(event.target.value)}
          helperText={isInShiftNames ? "Zmiana z taką nazwą już istnieje" : ""}
          error={isInShiftNames}
        />

        <br />

        <h4>Typ zmiany</h4>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="shiftType"
            name="shiftType"
            value={shiftType}
            onChange={(event): void => changeShiftType(event.target.value)}
          >
            <FormControlLabel value="working" control={<Radio />} label="Pracująca" />
            <FormControlLabel value="not_working" control={<Radio />} label="Niepracująca" />
          </RadioGroup>
        </FormControl>
        <br />

        <h4>Godziny zmiany</h4>
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

        <h4>Skrót zmiany</h4>
        <TextField
          type="text"
          placeholder="Skrót"
          value={shiftCode}
          onChange={(event): void => {
            setShiftCode(event.target.value);
            checkShiftCode(shiftCodes.includes(event.target.value));
            setCodeManuallyChanged(true);
          }}
          helperText={isInShiftCodes ? "Zmiana z takim kodem już istnieje" : ""}
          error={isInShiftCodes}
        />
        <br />

        <h4>Kolor zmiany</h4>

        <DropdownColors
          shiftType={shiftType}
          mainLabel="Wybierz kolory"
          buttonVariant="secondary"
          variant="colors"
          colorClicker={setPicked}
          selectedColor={colorPicked}
        />
        <div className={classNames("sitBottom", "alignCenter", "margin-24left")}>
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
            Dodaj zmianę
          </Button>
        </div>
      </div>
    </>
  );
}
