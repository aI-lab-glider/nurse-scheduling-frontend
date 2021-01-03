import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { Button } from "../../common-components/button-component/button.component";
import {
  ButtonData,
  DropdownButtons,
} from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

export default function ShiftEditDrower(): JSX.Element {
  const btnData1: ButtonData = {
    action: (): void => console.log("Color1"),
    label: "Wczytaj",
  };
  const btnData2: ButtonData = {
    action: (): void => console.log("Color2"),
    label: "Zapisz jako...",
  };

  const btnData = [btnData1, btnData2];

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
        <DropdownButtons
          buttons={btnData}
          mainLabel="Wybierz kolory"
          variant="outlined"
          dataCy={"file-dropdown"}
        />
        <Button size="small" className="submit-button" variant="primary">
          Dodaj zmianę
        </Button>
      </div>
    </>
  );
}
