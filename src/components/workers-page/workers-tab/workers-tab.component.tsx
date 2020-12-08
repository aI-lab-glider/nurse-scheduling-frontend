import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { WorkerType, WorkerTypeHelper } from "../../../common-models/worker-info.model";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { Button } from "../../common-components";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface WorkerData {
  name: string;
  type: WorkerType;
  time: number;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof WorkerData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

type Order = "asc" | "desc";
type Comparator = number;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): Comparator {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends number | string | symbol>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b): Comparator => descendingComparator(a, b, orderBy)
    : (a, b): Comparator => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => Comparator): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
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

function EnhancedTableHead(props: EnhancedTableProps): JSX.Element {
  const { classes, order, orderBy, onRequestSort } = props;
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
      </TableRow>
    </TableHead>
  );
}

export default function WorkersTab(): JSX.Element {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof WorkerData>("name");
  const [selected, setSelected] = React.useState<string[]>([]);
  const { type, time } = useSelector(
    (state: ApplicationStateModel) => state.scheduleData.present.employee_info
  );
  const [workerData, setWorkerData] = useState([] as WorkerData[]);

  useEffect(() => {
    const newWorkerData = Object.keys(type).map(
      (key): WorkerData => {
        return { name: key, type: type[key], time: time[key] };
      }
    );
    setWorkerData(newWorkerData);
  }, [type, time, setWorkerData]);

  function handleRequestSort(event: React.MouseEvent<unknown>, property: keyof WorkerData): void {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.checked) {
      const newSelected = workerData.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }

  const isSelected = (name: string): boolean => selected.indexOf(name) !== -1;

  return (
    <>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={workerData.length}
          />
          <TableBody>
            {stableSort(workerData, getComparator(order, orderBy)).map((worker) => {
              const isItemSelected = isSelected(worker.name);
              return (
                <TableRow key={worker.name} selected={isItemSelected}>
                  <TableCell component="th" scope="row">
                    {worker.name}
                  </TableCell>
                  <TableCell align="left">{WorkerTypeHelper.translate(worker.type)}</TableCell>
                  <TableCell align="left">{worker.time}</TableCell>
                  <TableCell align="right">
                    <Button variant="primary">Edytuj</Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined">Usuń</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
