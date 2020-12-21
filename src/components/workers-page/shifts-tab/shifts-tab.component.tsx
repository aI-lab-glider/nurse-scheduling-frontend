import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { shifts } from "../../../common-models/shift-info.model";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import ShiftDrawerComponent, { ShiftDrawerMode } from "./shift-drawer.component";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "0 0 0 10px",
      width: "100%",
    },
    tableCell: {
      color: `black`,
      fontWeight: "normal",
      fontSize: ScssVars.fontSizeBase,
      fontFamily: ScssVars.fontFamilyPrimary,
      letterSpacing: ScssVars.headingLetterSpacing,
      textAlign: "left",
      padding: "0 0 0 0",
    },
    row: {
      borderTop: `2px solid ${ScssVars.workerTableBorderColor}`,
    },
    colorSample: {
      width: "18px",
      height: "18px",
      borderRadius: "24px",
    },
  })
);

export default function ShiftTab(): JSX.Element {
  const classes = useStyles();
  const [open, setIsOpen] = useState(false);
  const [mode, setMode] = useState(ShiftDrawerMode.ADD_NEW);

  function toggleDrawer(open: boolean, mode?: ShiftDrawerMode): void {
    setIsOpen(open);
    mode !== undefined && setMode(mode);
  }

  return (
    <div className="workers-table">
      <TableContainer className={classes.root}>
        <Table size="small">
          <EnhancedTableHeaderComponent toggleDrawer={toggleDrawer} />
          <TableBody>
            {Object.values(shifts).map((shift) => {
              return (
                <TableRow key={shift.code} className={classes.row}>
                  <TableCell className={classes.tableCell}>{shift.name}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {shift.isWorkingShift ? `${shift.from}:00 ` : ""}-
                    {shift.isWorkingShift ? ` ${shift.to}:00` : ""}
                  </TableCell>
                  <TableCell className={classes.tableCell}>{shift.code}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <div
                      className={classes.colorSample}
                      style={{ backgroundColor: `#${shift.color}` }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="primary"
                      className="action-button"
                      onClick={(): void => toggleDrawer(true, ShiftDrawerMode.EDIT)}
                    >
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
      <ShiftDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false)}
        mode={mode}
        setOpen={setIsOpen}
      />
    </div>
  );
}
