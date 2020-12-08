import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Button } from "../../common-components";
import { WorkerData } from "../../../common-models/worker-info.model";
import { Order } from "../../../helpers/array.helper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof WorkerData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface WorkerDataCell {
  id: keyof WorkerData;
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

  function createSortHandler(property: keyof WorkerData, event: React.MouseEvent<unknown>): void {
    onRequestSort(event, property);
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={(event: React.MouseEvent<unknown>): void =>
                createSortHandler(headCell.id, event)
              }
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align={"right"} colSpan={2}>
          <Button variant="primary">Dodaj pracownika</Button>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
