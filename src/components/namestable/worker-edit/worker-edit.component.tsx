/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ContractType, WorkerType } from "../../../common-models/worker-info.model";
import { WorkerActionCreator } from "../../../state/reducers/worker.action-creator";
import { Button } from "../../common-components";
import { useWorkerInfo, WorkerInfo } from "../use-worker-info";
import { CombinedWorkNormSelector } from "./combined-worknorm-selector.component";
import { WorkerContractTypeSelector } from "./worker-contract-type-selector.component";
import { WorkerEditComponentOptions, WorkerEditComponentMode } from "./worker-edit.models";
import { WorkerNameEditField } from "./worker-name-edit-field.components";
import { WorkerWorkerTypeSelector } from "./worker-position-selector.component";

const useStyles = makeStyles({
  container: {
    height: "93%",
  },
});

export function WorkerEditComponent({
  name,
  mode,
  setOpen,
}: WorkerEditComponentOptions): JSX.Element {
  const classes = useStyles();

  const dispatcher = useDispatch();
  const { workerInfo, setWorkerInfo } = useWorkerInfo(name);
  const [isWorkerNameValid, setIsWorkerNameValid] = useState(true);
  const [isWorkerTimeValid, setIsWorkerTimeValid] = useState(true);
  const [isContractTypeValid, setIsContractTypeValid] = useState(true);
  const [isWorkerTypeValid, setIsWorkerTypeValid] = useState(true);

  useEffect(() => {
    if (mode === WorkerEditComponentMode.EDIT) {
      workerInfo.previousWorkerName = name;
    }
  }, [mode, workerInfo, name]);
  //#region event handlers
  function handleWorkerNameUpdate(newWorkerName: string): void {
    setWorkerInfo(workerInfo.withNewName(newWorkerName));
  }

  function handleWorkerTimeUpdate(newWorkerTime: number): void {
    setWorkerInfo(workerInfo.withNewWorkerTime(newWorkerTime));
  }

  function handleWorkerContractTypeUpdate(newContractType: ContractType): void {
    setWorkerInfo(workerInfo.withNewContractType(newContractType));
  }

  function handleWorkerWorkerTypeUpdate(newWorkerType: WorkerType): void {
    setWorkerInfo(workerInfo.withNewWorkerType(newWorkerType));
  }
  //#endregion

  function canSaveWorker(): boolean {
    return [isWorkerNameValid, isWorkerTimeValid, isContractTypeValid, isWorkerTypeValid].every(
      (item) => item
    );
  }

  function handleClose(): void {
    const newWorker = workerInfo.asWorkerInfoExtendedInterface();
    mode === WorkerEditComponentMode.ADD
      ? dispatcher(WorkerActionCreator.addNewWorker(newWorker))
      : dispatcher(WorkerActionCreator.modifyWorker(newWorker));

    setWorkerInfo(new WorkerInfo());
    setOpen(false);
  }

  // #region view
  return (
    <Grid container direction="column" justify="space-between">
      <Grid container className={classes.container} direction="column" spacing={5}>
        <WorkerNameEditField
          workerName={workerInfo.workerName}
          setWorkerName={handleWorkerNameUpdate}
          setIsFieldValid={setIsWorkerNameValid}
          mode={mode}
        />

        <WorkerWorkerTypeSelector
          workerType={workerInfo.workerType}
          setActualWorkerType={handleWorkerWorkerTypeUpdate}
          setIsFieldValid={setIsWorkerTypeValid}
        />

        <WorkerContractTypeSelector
          setWorkerContractType={handleWorkerContractTypeUpdate}
          workerContractType={workerInfo.contractType}
          setIsFieldValid={setIsContractTypeValid}
        />

        <CombinedWorkNormSelector
          employmentTime={workerInfo.workerTime}
          setWorkerTime={handleWorkerTimeUpdate}
          setIsFieldValid={setIsWorkerTimeValid}
          workerContractType={workerInfo.contractType}
        />
      </Grid>
      <Grid item>
        <Button
          disabled={!canSaveWorker()}
          variant="primary"
          className={classNames({ "disabled-submit-button": !canSaveWorker() })}
          data-cy="btn-save-worker"
          onClick={handleClose}
        >
          Zapisz pracownika
        </Button>
      </Grid>
    </Grid>
  );
  //#endregion
}
