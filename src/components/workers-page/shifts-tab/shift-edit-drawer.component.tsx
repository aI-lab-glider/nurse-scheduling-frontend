import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { Button } from "../../common-components/button-component/button.component";
import { ColorSelector } from "../../common-components/color-selector/color-selector.component";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { Shift } from "../../../common-models/shift-info.model";

export default function ShiftEditDrower(): JSX.Element {
  const [valueTimeStart, onChangeTimeStart] = useState<Date | null>(
    new Date("2021-01-01T23:00:00.000Z")
  );
  const [valueTimeEnd, onChangeTimeEnd] = useState<Date | null>(
    new Date("2021-01-01T23:00:00.000Z")
  );
  const [value, setValue] = useState("working");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [colorPicked, setPicked] = useState("000000");
  const colorClicked = (event: string) => setPicked(event);

  const [newShift, setShift] = useState<Shift | null>(null);
  const setNewShift = (event: Shift) => {
    setShift(event);
  };
  return (
    <>
      <div className={"edit-field"}>
        <h4>Nazwa zmiany</h4>
        <TextField type="text" placeholder="Nazwa zmiany" />
        <br />
        <h4>Typ zmiany</h4>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="shiftType"
            name="shiftType1"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value="working" control={<Radio />} label="Pracująca" />
            <FormControlLabel value="not_working" control={<Radio />} label="Niepracująca" />
          </RadioGroup>
        </FormControl>
        <br />
        <h4>Godziny zmiany</h4>
        <div className={"time-range"}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              label=""
              placeholder="00:00"
              ampm={false}
              mask="__:__"
              value={valueTimeStart}
              onChange={onChangeTimeStart}
            />
            <p>&ndash;</p>
            <KeyboardTimePicker
              label=""
              placeholder="00:00"
              ampm={false}
              mask="__:__"
              value={valueTimeEnd}
              onChange={onChangeTimeEnd}
            />
          </MuiPickersUtilsProvider>
        </div>
        <br />

        <h4>Skrót zmiany</h4>
        <TextField type="text" placeholder="Skrót" />
        <br />

        <h4>Kolor zmiany</h4>
        <ColorSelector
          shiftType={value}
          mainLabel="Wybierz kolory"
          variant="outlined"
          position={"bottom"}
          colorClicker={colorClicked}
        />
        <Button
          size="small"
          className="submit-button"
          variant="primary"
          onClick={(): void => {
            setNewShift({ code: "", name: "", from: 0, to: 12, color: colorPicked });
            console.log(newShift);
          }}
        >
          Dodaj zmianę
        </Button>
      </div>
    </>
  );
}
