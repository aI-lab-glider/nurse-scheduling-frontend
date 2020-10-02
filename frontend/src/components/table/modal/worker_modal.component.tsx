import React, { useState } from "react";
import { Modal, TextField } from "@material-ui/core";
import "./worker_modal.component.css";
import { WorkerTypeHelper } from "../../../state/models/schedule-data/employee-info.model";
import Button from "@material-ui/core/Button";

export function WorkerModal({ isOpened, setIsOpened, submit, workerType }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [time, setTime] = useState("1.0");
  const [timeError, setTimeError] = useState(false);

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const parseTimeIfPossible = (time) => {
    if (new RegExp("([0].[0-9])|(1.0)").test(time)) {
      return { isTimeFormatValid: true, parsedTime: Number(time) };
    }
    if (new RegExp("[1-9]/[0-9]").test(time)) {
      const timerArray = time.split("/");
      if (timerArray[0] <= timerArray[1]) {
        return { isTimeFormatValid: true, parsedTime: Number(timerArray[0] / timerArray[1]) };
      }
    }
    return { isTimeFormatValid: false, parsedTime: null };
  };

  const validateName = (name) => {
    return name.length > 5;
  };

  const handleSubmit = () => {
    const { isTimeFormatValid, parsedTime } = parseTimeIfPossible(time);
    const isNameValid = validateName(name);
    if (isTimeFormatValid) {
      setTimeError(false);
      if (isNameValid) {
        setNameError(false);
        submit(name, parsedTime);
        handleClose();
      }
      setNameError(true);
    } else {
      setTimeError(true);
    }
  };

  const body = (
    <div className="workerModal">
      <h2 id="modal-title">
        Dodaj nowego pracownika do sekcji {WorkerTypeHelper.translate(workerType, true)}
      </h2>
      <form>
        <TextField
          id="name-input"
          label="Imię i nazwisko"
          value={name}
          onChange={handleNameChange}
          required
          error={nameError}
          helperText={"Muszą mieć co najmniej 5 znaków"}
        />
        <TextField
          id="time-input"
          label="Etat"
          value={time}
          onChange={handleTimeChange}
          required
          helperText={"Obsługiwane formaty to: dziesiętny np. 0.1 i ułamkowy np. 3/5"}
          error={timeError}
        />
        <Button onClick={handleSubmit} className="submit-button" variant="outlined">
          Dodaj
        </Button>
      </form>
    </div>
  );

  return (
    <Modal open={isOpened} onClose={handleClose}>
      {body}
    </Modal>
  );
}
