import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { Button } from "../../common-components/button-component/button.component";
import { ColorSelector } from "../../common-components/color-selector/color-selector.component";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { Shift, shifts } from "../../../common-models/shift-info.model";
import { AcronymGenerator } from "../../../helpers/acronym-generator.helper";

export default function ShiftEditDrower(): JSX.Element {
  const shiftNames = Object.values(shifts).map((shift) => shift.name);
  const shiftCodes = Object.values(shifts).map((shift) => shift.code);
  const [shiftName, setShiftName] = useState("");
  const [shiftCode, setShiftCode] = useState("");

  const [isInShiftNames, checkShiftName] = useState(false);
  const [isInShiftCodes, checkShiftCode] = useState(false);

  const shiftNameTextFieldOnChange = (shiftNameActual: string): void => {
    setShiftName(shiftNameActual);
    setShiftCode(AcronymGenerator.generate(shiftNameActual));
    checkShiftName(shiftNames.includes(shiftNameActual));
  };

  const [valueTimeStart, onChangeTimeStart] = useState<Date | null>(
    new Date("2021-01-01T23:00:00.000Z")
  );
  const [valueTimeEnd, onChangeTimeEnd] = useState<Date | null>(
    new Date("2021-01-01T23:00:00.000Z")
  );
  const [valueRadio, setValueRadio] = useState("working");
  const radioChange = (shiftType: string): void => {
    setValueRadio(shiftType);
  };

  const [colorPicked, setPicked] = useState("");
  const colorClicked = (colorChosen: string): void => setPicked(colorChosen);

  const [, setShift] = useState<Shift | null>(null);
  const setNewShift = (createdShift: Shift): void => setShift(createdShift);

  return (
    <>
      <div className={"edit-field"}>
        <h4>Nazwa zmiany</h4>
        <TextField
          type="text"
          placeholder="Nazwa zmiany"
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
            value={valueRadio}
            onChange={(event): void => radioChange(event.target.value)}
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
          }}
          helperText={isInShiftCodes ? "Zmiana z takim kodem już istnieje" : ""}
          error={isInShiftCodes}
        />
        <br />

        <h4>Kolor zmiany</h4>
        <ColorSelector
          shiftType={valueRadio}
          mainLabel="Wybierz kolory"
          variant="secondary"
          position={"bottom"}
          colorClicker={colorClicked}
        />
        <Button
          variant="primary"
          onClick={(): void => {
            setNewShift({
              code: shiftCode,
              name: shiftName,
              from: valueTimeStart?.getHours() ?? 0,
              to: valueTimeEnd?.getHours() ?? 0,
              color: colorPicked,
            });
          }}
        >
          Dodaj zmianę
        </Button>
      </div>
    </>
  );
}
