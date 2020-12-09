import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { WorkerData, WorkerTypeHelper } from "../../../common-models/worker-info.model";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header-component";
import { ArrayHelper, Comparator, Order } from "../../../helpers/array.helper";
import { StringHelper } from "../../../helpers/string.helper";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames/bind";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): Comparator {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  } else if (b[orderBy] > a[orderBy]) {
    return 1;
  } else {
    return 0;
  }
}

function getComparator<Key extends number | string | symbol>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => Comparator {
  return order === "desc"
    ? (a, b): Comparator => descendingComparator(a, b, orderBy)
    : (a, b): Comparator => -descendingComparator(a, b, orderBy);
}

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
  const [orderBy, setOrderBy] = React.useState<keyof WorkerData>("name");
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
  return (
    <div className="workers-table">
      <TableContainer className={classes.root}>
        <Table size="small">
          <EnhancedTableHeaderComponent
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={workerData.length}
          />
          <TableBody>
            {ArrayHelper.stableSort(workerData, getComparator(order, orderBy)).map((worker) => {
              return (
                <TableRow key={worker.name} className={classes.row}>
                  <TableCell className={classes.tableCell}>{worker.name}</TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    <span
                      className={classNames(
                        "worker-label",
                        `${worker.type.toString().toLowerCase()}-label`
                      )}
                    >
                      {StringHelper.capitalize(WorkerTypeHelper.translate(worker.type))}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {worker.time}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="primary" className="action-button">
                      Edytuj
                    </Button>
                    <Button variant="outlined" className="action-button">
                      Usuń
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
