/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as S from "./workers-tab.styled";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
} from "../../../components/drawers/worker-drawer/worker-drawer.component";
import DeleteWorkerModalComponent from "../../../components/modals/delete-worker-modal/delete-worker.modal.component";
import { ComparatorHelper, Order } from "../../../helpers/comparator.helper";
import { ContractTypeHelper } from "../../../helpers/contract-type.helper";
import { StringHelper } from "../../../helpers/string.helper";
import { WorkerTypeHelper } from "../../../helpers/worker-type.helper";
import { WorkingTimeHelper } from "../../../helpers/working-time.helper";
import { useMonthInfo } from "../../../hooks/use-month-info";
import { WorkerHourInfo } from "../../../logic/schedule-logic/worker-hours-info.logic";
import { DEFAULT_CONTRACT_TYPE } from "../../../logic/schedule-parser/workers-info.parser";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { WorkerName } from "../../../state/schedule-data/schedule-sensitive-data.model";
import {
  ContractType,
  WorkerInfoModel,
} from "../../../state/schedule-data/worker-info/worker-info.model";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      paddingTop: 0,
      width: "100%",
    },
    tableCell: {
      color: ScssVars.primary,
      fontWeight: "normal",
      fontSize: ScssVars.fontSizeBase,
      fontFamily: ScssVars.fontFamilyPrimary,
      letterSpacing: ScssVars.headingLetterSpacing,
    },
    row: {
      borderTop: `2px solid ${ScssVars.workerTableBorderColor}`,
    },
  })
);

export default function WorkersTab(): JSX.Element {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof WorkerInfoModel>("name");
  const { type, time, contractType, team } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.employee_info
  );
  const { year, monthNumber } = useMonthInfo();

  const [workerData, setWorkerData] = useState([] as WorkerInfoModel[]);
  const [open, setIsOpen] = useState(false);
  const [openDelModal, setDelModalOpen] = useState(false);
  const [mode, setMode] = useState(WorkerDrawerMode.ADD_NEW);
  const [worker, setWorker] = useState<WorkerInfoModel | undefined>(undefined);

  useEffect(() => {
    const newWorkerData = Object.keys(type).map(
      (key): WorkerInfoModel => ({
        name: key as WorkerName,
        type: type[key],
        time: time[key],
        team: team[key],
      })
    );
    setWorkerData(newWorkerData);
  }, [type, time, setWorkerData, team]);

  function handleRequestSort(
    event: React.MouseEvent<unknown>,
    property: keyof WorkerInfoModel
  ): void {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  function toggleDrawer(
    open: boolean,
    mode?: WorkerDrawerMode,
    workerData?: WorkerInfoModel
  ): void {
    setIsOpen(open);
    mode !== undefined && setMode(mode);
    setWorker(workerData);
  }

  function workerDeleteModal(open: boolean, workerData?: WorkerInfoModel): void {
    setDelModalOpen(open);
    setWorker(workerData);
  }

  const getWorkerTimeLabel = useCallback(
    (workerName: string) => {
      const workHourNormInMonth = WorkerHourInfo.calculateWorkNormForMonth(monthNumber, year);
      const workerContractType = contractType?.[workerName] ?? DEFAULT_CONTRACT_TYPE;
      const contractTypeLabel = ContractTypeHelper.translate(workerContractType);
      const workerTimeLabel =
        workerContractType === ContractType.CIVIL_CONTRACT
          ? `${time[workerName] * workHourNormInMonth} godz.`
          : WorkingTimeHelper.fromHoursToFraction(
              time[workerName] * workHourNormInMonth,
              workHourNormInMonth
            );
      return `${contractTypeLabel} ${workerTimeLabel}`;
    },
    [year, monthNumber, time, contractType]
  );

  return (
    <S.Wrapper>
      <TableContainer className={classes.root}>
        <Table size="small">
          <EnhancedTableHeaderComponent
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={workerData.length}
            toggleDrawer={toggleDrawer}
          />
          <TableBody>
            {ComparatorHelper.stableSort(workerData, order, orderBy).map((worker) => {
              const workerType = worker.type ?? S.WorkerType.NURSE;

              return (
                <TableRow key={worker.name} className={classes.row}>
                  <TableCell className={classes.tableCell} data-cy="workerName">
                    {worker.name}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    <S.WorkerType className={`${workerType.toString().toLowerCase()}-label`}>
                      {StringHelper.capitalize(WorkerTypeHelper.translate(workerType))}
                    </S.WorkerType>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {getWorkerTimeLabel(worker.name)}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {worker.team}
                  </TableCell>
                  <TableCell align="right">
                    <S.ActionButton
                      variant="primary"
                      onClick={(): void => toggleDrawer(true, WorkerDrawerMode.EDIT, worker)}
                    >
                      Edytuj
                    </S.ActionButton>
                    <S.ActionButton
                      variant="secondary"
                      onClick={(): void => workerDeleteModal(true, worker)}
                    >
                      Usuń
                    </S.ActionButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <WorkerDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false)}
        mode={mode}
        worker={worker}
        setOpen={setIsOpen}
      />
      <DeleteWorkerModalComponent setOpen={setDelModalOpen} open={openDelModal} worker={worker} />
    </S.Wrapper>
  );
}
