import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { WorkerType, WorkerTypeHelper } from "../../../common-models/worker-info.model";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

interface WorkerData {
  name: string;
  type: WorkerType;
  time: number;
}

export default function WorkersTab(): JSX.Element {
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

  return (
    <>
      <Button>Stanowisko</Button>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Imię i nazwisko</TableCell>
              <TableCell align="left">Stanowisko</TableCell>
              <TableCell align="left">Wymiar pracy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workerData.map((worker) => (
              <TableRow key={worker.name}>
                <TableCell component="th" scope="row">
                  {worker.name}
                </TableCell>
                <TableCell align="left">{WorkerTypeHelper.translate(worker.type)}</TableCell>
                <TableCell align="left">{worker.time}</TableCell>
                <TableCell align="right">
                  <Button>Edytuj</Button>
                </TableCell>
                <TableCell align="right">
                  <Button>Usuń</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
