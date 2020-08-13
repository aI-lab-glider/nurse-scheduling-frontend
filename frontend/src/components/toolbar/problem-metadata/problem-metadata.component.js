import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import plLocale from "date-fns/locale/pl";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

function ProblemMetadataComponent() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <form autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
        <DatePicker
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          label="Z miesiąca"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
      <TextField id="children" label="Ilość dzieci" />
      <TextField id="nurses" label="Ilość pielęgniarek" />
      <TextField id="babysitters" label="Ilość opiekunek" />
    </form>
  );
}

export default ProblemMetadataComponent;
