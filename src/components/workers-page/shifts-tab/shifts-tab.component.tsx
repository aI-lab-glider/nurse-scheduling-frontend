import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { ShiftCode, shifts } from "../../../common-models/shift-info.model";
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
      width: "212px",
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
  const shiftCodes: ShiftCode[] = [
    ShiftCode.D,
    ShiftCode.N,
    ShiftCode.R,
    ShiftCode.P,
    ShiftCode.L4,
    ShiftCode.U,
  ];

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
            {shiftCodes.map((shiftCode) => {
              return (
                <TableRow key={shifts[shiftCode].code} className={classes.row}>
                  <TableCell className={classes.tableCell}>{shifts[shiftCode].name}</TableCell>
                  <TableCell className={classes.tableCell} style={{ width: "120px" }}>
                    {shifts[shiftCode].isWorkingShift ? `${shifts[shiftCode].from}:00 ` : ""}-
                    {shifts[shiftCode].isWorkingShift ? ` ${shifts[shiftCode].to}:00` : ""}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ width: "94px" }}>
                    {shifts[shiftCode].code}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <div
                      className={classes.colorSample}
                      style={{ backgroundColor: `#${shifts[shiftCode].color}` }}
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
