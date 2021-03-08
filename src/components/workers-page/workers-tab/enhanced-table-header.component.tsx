/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames/bind";
import { Order } from "../../../helpers/comparator.helper";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";
import { WorkerDrawerMode } from "./worker-drawer.component";

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      color: ScssVars.primary,
      fontWeight: "normal",
      fontSize: ScssVars.fontSizeBase,
      fontFamily: ScssVars.fontFamilyPrimary,
      letterSpacing: ScssVars.headingLetterSpacing,
    },
    activeLabel: {
      fontWeight: "bold",
    },
  })
);

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof WorkerInfoModel) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  toggleDrawer: (open: boolean, mode?: WorkerDrawerMode, workerData?: WorkerInfoModel) => void;
}

interface WorkerDataCell {
  id: keyof WorkerInfoModel;
  label: string;
  numeric: boolean;
}

const headCells: WorkerDataCell[] = [
  { id: "name", numeric: false, label: "Imię i nazwisko" },
  { id: "type", numeric: true, label: "Stanowisko" },
  { id: "time", numeric: true, label: "Wymiar pracy" },
];

export function EnhancedTableHeaderComponent(props: EnhancedTableProps): JSX.Element {
  const classes = useStyles();
  const { order, orderBy, onRequestSort, toggleDrawer } = props;

  function createSortHandler(
    property: keyof WorkerInfoModel,
    event: React.MouseEvent<unknown>
  ): void {
    onRequestSort(event, property);
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          const isActive = orderBy === headCell.id;
          return (
            <TableCell key={headCell.id} sortDirection={isActive ? order : false}>
              <TableSortLabel
                active={isActive}
                direction={isActive ? order : "asc"}
                onClick={(event: React.MouseEvent<unknown>): void =>
                  createSortHandler(headCell.id, event)
                }
                className={classNames(classes.label, { [classes.activeLabel]: isActive })}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          );
        })}
        <TableCell align="right">
          <Button
            className="header-button"
            variant="primary"
            data-cy="btn-add-worker"
            onClick={(): void => {
              toggleDrawer(true, WorkerDrawerMode.ADD_NEW, undefined);
            }}
          >
            Dodaj pracownika
          </Button>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
