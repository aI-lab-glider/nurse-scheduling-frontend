import React, { useEffect, useState } from "react";
import { Modal, TextField } from "@material-ui/core";
import { WorkerInfo, WorkerType, WorkerTypeHelper } from "../../common-models/worker-info.model";
import Button from "@material-ui/core/Button";

const initialState = {
  name: "",
  nameError: false,
  time: "",
  timeError: false,
  actionName: "Dodaj nowego pracownika do sekcji",
  isNewWorker: false,
};

interface ParseTimeModel {
  isTimeFormatValid: boolean;
  parsedTime?: number;
}

interface AddWorkerModalOptions {
  isOpened: boolean;
  setIsOpened: (status: boolean) => void;
  submit: (workerInfo: WorkerInfo) => void;
  workerType: WorkerType;
  workerInfo?: WorkerInfo;
}
const NAME_MIN_LENGTH = 5;

export function AddWorkerModal({
  isOpened,
  setIsOpened,
  submit,
  workerType,
  workerInfo,
}: AddWorkerModalOptions): JSX.Element {
  const [{ name, nameError, time, timeError, actionName, isNewWorker }, setState] = useState(
    initialState
  );

  useEffect(() => {
    const { name = "", time = 0 } = workerInfo || {};
    const isNewWorker = name.length === 0;
    const actionName = isNewWorker
      ? `Dodaj nowego pracownika do sekcji ${WorkerTypeHelper.translate(workerType, true)}`
      : `Edytuj pracownika: ${name}`;
    setState((prev) => ({
      ...prev,
      name,
      time: time + "",
      actionName,
      isNewWorker,
    }));
  }, [workerInfo, workerType]);

  function clearState(): void {
    setState({ ...initialState });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name: controlName, value } = e.target;
    setState((prevState) => ({ ...prevState, [controlName]: value }));
  }

  function parseTimeIfPossible(time: string): ParseTimeModel {
    if (new RegExp("^([1-9]/[1-9])$").test(time)) {
      const timerArray = time.split("/").map((t) => parseInt(t));
      if (timerArray[0] <= timerArray[1]) {
        return { isTimeFormatValid: true, parsedTime: Number(timerArray[0] / timerArray[1]) };
      }
    }
    if (new RegExp("^([0].[l0-9])|(1.0)|(1)$").test(time)) {
      return { isTimeFormatValid: true, parsedTime: Number(time) };
    }

    return { isTimeFormatValid: false };
  }

  function validateName(name: string): boolean {
    return name.length >= NAME_MIN_LENGTH;
  }

  function handleSubmit(): void {
    const { isTimeFormatValid, parsedTime } = parseTimeIfPossible(time);
    const isNameValid = validateName(name);

    if (isTimeFormatValid) {
      setState((prevState) => ({ ...prevState, timeError: false }));
      if (isNameValid) {
        submit({ name, time: parsedTime });
        handleClose();
      } else {
        setState((prevState) => ({ ...prevState, nameError: true }));
      }
    } else {
      setState((prevState) => ({ ...prevState, timeError: true }));
    }
  }

  function handleClose(): void {
    clearState();
    setIsOpened(false);
  }

  const body = (
    <div className="worker-modal">
      <h2 id="modal-title">{actionName}</h2>
      <form>
        <TextField
          id="name-input"
          label="Imię i nazwisko"
          value={name}
          name="name"
          inputProps={{
            readOnly: !isNewWorker,
          }}
          onChange={onChange}
          required
          error={nameError}
          helperText={`Musi mieć co najmniej ${NAME_MIN_LENGTH} znaków`}
        />
        <TextField
          id="time-input"
          label="Etat"
          value={time}
          name={"time"}
          onChange={onChange}
          required
          helperText={"Obsługiwane formaty to: dziesiętny np. 0.1 i ułamkowy np. 3/5"}
          error={timeError}
        />
        <Button onClick={handleSubmit} className="add-worker-button" variant="outlined">
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
