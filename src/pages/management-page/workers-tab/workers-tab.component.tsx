/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import {
  ContractType,
  WorkerInfoModel,
} from "../../../state/schedule-data/worker-info/worker-info.model";
import { ContractTypeHelper } from "../../../helpers/contract-type.helper";
import { WorkerTypeHelper } from "../../../helpers/worker-type.helper";
import { ComparatorHelper, Order } from "../../../helpers/comparator.helper";
import { WorkerHourInfo } from "../../../helpers/worker-hours-info.model";
import { StringHelper } from "../../../helpers/string.helper";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { Button } from "../../../components/common-components";
import DeleteWorkerModalComponent from "../../../components/modals/delete-worker-modal/delete-worker.modal.component";
import { WorkingTimeHelper } from "../../../helpers/working-time.helper";
import { useMonthInfo } from "../../../hooks/use-month-info";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
} from "../../../components/drawers/worker-drawer/worker-drawer.component";
import { DEFAULT_CONTRACT_TYPE } from "../../../logic/schedule-parser/workers-info.parser";
import styled from "styled-components";
import { colors, fontSizeXs } from "../../../assets/colors";

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
  const { type, time, contractType, workerGroup } = useSelector(
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
      (key): WorkerInfoModel => {
        return { name: key, type: type[key], time: time[key], workerGroup: workerGroup[key] };
      }
    );
    setWorkerData(newWorkerData);
  }, [type, time, setWorkerData, workerGroup]);

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
          ? time[workerName] * workHourNormInMonth + " godz."
          : WorkingTimeHelper.fromHoursToFraction(
              time[workerName] * workHourNormInMonth,
              workHourNormInMonth
            );
      return `${contractTypeLabel} ${workerTimeLabel}`;
    },
    [year, monthNumber, time, contractType]
  );

  return (
    <Wrapper>
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
              const workerType = worker.type ?? WorkerType.NURSE;

              return (
                <TableRow key={worker.name} className={classes.row}>
                  <TableCell className={classes.tableCell} data-cy="workerName">
                    {worker.name}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    <WorkerType className={`${workerType.toString().toLowerCase()}-label`}>
                      {StringHelper.capitalize(WorkerTypeHelper.translate(workerType))}
                    </WorkerType>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {getWorkerTimeLabel(worker.name)}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {worker.workerGroup}
                  </TableCell>
                  <TableCell align="right">
                    <ActionButton
                      variant="primary"
                      onClick={(): void => toggleDrawer(true, WorkerDrawerMode.EDIT, worker)}
                    >
                      Edytuj
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={(): void => workerDeleteModal(true, worker)}
                    >
                      Usuń
                    </ActionButton>
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
    </Wrapper>
  );
}
const Wrapper = styled.div`
  margin-top: 45px;
`;

const WorkerType = styled.span`
  border-radius: 20px;
  font-weight: 400;
  letter-spacing: 0.025em;
  background-color: ${colors.nurseColor};
  padding: 6px;

  &.nurse-label {
    background-color: ${colors.nurseColor};
  }

  &.other-label {
    background-color: ${colors.babysitterLabelBackground};
  }
`;

const ActionButton = styled(Button)`
  font-size: ${fontSizeXs};
  padding: 2px 25px 2px;
`;
