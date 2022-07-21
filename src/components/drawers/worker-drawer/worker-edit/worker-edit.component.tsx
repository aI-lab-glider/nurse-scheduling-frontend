/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FontStyles from "../../../../assets/theme/FontStyles";
import { t } from "../../../../helpers/translations.helper";
import { useWorkerInfo, WorkerInfo } from "../../../../hooks/use-worker-info";
import { WorkerName } from "../../../../state/schedule-data/schedule-sensitive-data.model";
import {
  ContractType,
  Team,
  WorkerType
} from "../../../../state/schedule-data/worker-info/worker-info.model";
import { WorkerActionCreator } from "../../../../state/schedule-data/worker-info/worker.action-creator";
import { LineSeparator } from "../../../separators/LineSeparator";
import { CombinedWorkNormSelector } from "./combined-worknorm-selector.component";
import { WorkerContractTypeSelector } from "./worker-contract-type-selector.component";
import { WorkerEditComponentMode, WorkerEditComponentOptions } from "./worker-edit.models";
import { WorkerNameEditField } from "./worker-name-edit-field.components";
import { WorkerWorkerTypeSelector } from "./worker-position-selector.component";
import { TeamSelector } from "./worker-team-selector.component";
import * as S from "./worker.styled";

export function WorkerEditComponent(options: WorkerEditComponentOptions): JSX.Element {
  const { mode, setOpen } = options;

  const dispatcher = useDispatch();

  const getWorkerName = useCallback(
    (workerOptions: WorkerEditComponentOptions) =>
      workerOptions.mode === WorkerEditComponentMode.EDIT ? workerOptions.name : ("" as WorkerName),
    []
  );

  const { workerInfo, setWorkerInfo } = useWorkerInfo(getWorkerName(options));
  const [isWorkerNameValid, setIsWorkerNameValid] = useState(true);
  const [isWorkerTimeValid, setIsWorkerTimeValid] = useState(true);
  const [isContractTypeValid, setIsContractTypeValid] = useState(true);
  const [isWorkerTypeValid, setIsWorkerTypeValid] = useState(true);

  useEffect(() => {
    if (options.mode === WorkerEditComponentMode.EDIT) {
      workerInfo.previousWorkerName = options.name;
    }
  }, [mode, workerInfo, options]);
  // #region event handlers
  const handleWorkerNameUpdate = useCallback((newWorkerName: string) => {
    setWorkerInfo(workerInfo.withNewName(newWorkerName));
  }, [setWorkerInfo, workerInfo])

  const handleWorkerTimeUpdate = useCallback((newWorkerTime: number) => {
    setWorkerInfo(workerInfo.withNewWorkerTime(newWorkerTime));
  }, [setWorkerInfo, workerInfo])

  const handleWorkerContractTypeUpdate = useCallback((newContractType: ContractType) => {
    setWorkerInfo(workerInfo.withNewContractType(newContractType));
  }, [setWorkerInfo, workerInfo])

  const handleWorkerWorkerTypeUpdate = useCallback((newWorkerType: WorkerType) => {
    setWorkerInfo(workerInfo.withNewWorkerType(newWorkerType));
  }, [setWorkerInfo, workerInfo])

  const handleWorkerTeamUpdate = useCallback((newTeam: Team) => {
    setWorkerInfo(workerInfo.withNewTeam(newTeam));
  }, [setWorkerInfo, workerInfo])
  // #endregion

  const canSaveWorker = useCallback(() => [isWorkerNameValid, isWorkerTimeValid, isContractTypeValid, isWorkerTypeValid].every(
    (item) => item
  )
    , [isWorkerNameValid, isWorkerTimeValid, isContractTypeValid, isWorkerTypeValid])

  const handleClose = useCallback(() => {
    const newWorker = workerInfo.asWorkerInfoExtendedInterface();
    mode === WorkerEditComponentMode.ADD
      ? dispatcher(WorkerActionCreator.addNewWorker(newWorker))
      : dispatcher(WorkerActionCreator.modifyWorker(newWorker));

    setWorkerInfo(new WorkerInfo());
    setOpen(false);
  }, [setOpen, setWorkerInfo, dispatcher, mode, workerInfo])

  // #region view
  return (
    <Grid container direction="column" justify="space-between">
      <div
        style={{
          flexDirection: "row",
          marginTop: "42px",
          marginBottom: "20px",
          alignContent: "center",
          justifyItems: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            float: "left",
          }}
        >
          <p style={{ ...FontStyles.roboto.Black16px }}>{t("editWorker")}</p>
        </div>
        <S.SubmitButton
          variant="secondary"
          data-cy="btn-save-worker"
          onClick={() => setOpen(false)}
        >
          {t("editPageToolbarExit")}
        </S.SubmitButton>
        <S.SubmitButton
          disabled={!canSaveWorker()}
          variant="primary"
          data-cy="btn-save-worker"
          onClick={handleClose}
        >
          {t("saveWorker")}
        </S.SubmitButton>
      </div>
      <LineSeparator text={t("essentialInformation")} />
      <S.OptionsContainer container direction="column">
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
          workerTime={workerInfo.workerTime}
          setWorkerTime={handleWorkerTimeUpdate}
          setIsFieldValid={setIsWorkerTimeValid}
          workerContractType={workerInfo.contractType}
        />

        <TeamSelector team={workerInfo.team} setTeam={handleWorkerTeamUpdate} />
      </S.OptionsContainer>
    </Grid>
  );
  // #endregion
}
