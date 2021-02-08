/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import {
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../../common-models/worker-info.model";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import { StringHelper } from "../../../helpers/string.helper";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames/bind";
import { ComparatorHelper, Order } from "../../../helpers/comparator.helper";
import WorkerDrawerComponent, { WorkerDrawerMode } from "./worker-drawer.component";
import DeleteUserModalComponent from "../../common-components/modal/delete-user-modal/delete-user.modal.component";

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
  const { type, time } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.employee_info
  );
  const [workerData, setWorkerData] = useState([] as WorkerInfoModel[]);
  const [open, setIsOpen] = useState(false);
  const [openDelModal, setDelModalOpen] = useState(false);
  const [mode, setMode] = useState(WorkerDrawerMode.ADD_NEW);
  const [worker, setWorker] = useState<WorkerInfoModel | undefined>(undefined);

  useEffect(() => {
    const newWorkerData = Object.keys(type).map(
      (key): WorkerInfoModel => {
        return { name: key, type: type[key], time: time[key] };
      }
    );
    setWorkerData(newWorkerData);
  }, [type, time, setWorkerData]);

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

  return (
    <div className="workers-table">
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
                    <span
                      className={classNames(
                        "worker-label",
                        `${workerType.toString().toLowerCase()}-label`
                      )}
                    >
                      {StringHelper.capitalize(WorkerTypeHelper.translate(workerType))}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {worker.time}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="primary"
                      className="action-button"
                      onClick={(): void => toggleDrawer(true, WorkerDrawerMode.EDIT, worker)}
                    >
                      Edytuj
                    </Button>
                    <Button
                      variant="outlined"
                      className="action-button"
                      onClick={(): void => setDelModalOpen(true)}
                    >
                      Usuń
                    </Button>
                    <DeleteUserModalComponent
                      setOpen={setDelModalOpen}
                      open={openDelModal}
                      worker={worker}
                    />
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
    </div>
  );
}
