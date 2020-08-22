import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import plLocale from "date-fns/locale/pl";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

function ProblemMetadataComponent() {
  const [selectedDate, handleDateChange] = useState(new Date());
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [numberOfNurses, setNumberOfNurses] = useState("");
  const [numberOfSitters, setNumberOfSitters] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Metadata form submitted!");
  };

  function textField(id, label, value, setFunction) {
    return (
      <TextField
        required
        id={id}
        label={label}
        value={value}
        onChange={(e) => setFunction(e.target.value)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
        <DatePicker
          required
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          label="Z miesiąca"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>

      {textField("children", "Ilość dzieci", numberOfChildren, setNumberOfChildren)}
      {textField("nurses", "Ilość pielęgniarek", numberOfNurses, setNumberOfNurses)}
      {textField("sitters", "Ilość opiekunek", numberOfSitters, setNumberOfSitters)}

      <Button type="submit" variant="contained" color="primary">
        Poprawić harmonogram
      </Button>
    </form>
  );
}

export default ProblemMetadataComponent;
