import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames/bind";
import { Order } from "../../../helpers/comparator-helper";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";

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
  const { order, orderBy, onRequestSort } = props;

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
          <Button variant="primary">Dodaj pracownika</Button>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
