import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import {
  DisplayedShiftData,
  ShiftCode,
  ShiftHours,
  ShiftName,
} from "../../../common-models/shift-info.model";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import ShiftDrawerComponent, { ShiftDrawerMode } from "./shift-drawer.component";

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
  const shiftData: DisplayedShiftData[] = [
    { code: ShiftCode.D, name: ShiftName.D, hours: ShiftHours.D, color: "CBEECB" },
    { code: ShiftCode.N, name: ShiftName.N, hours: ShiftHours.N, color: "B7BCC7" },
    { code: ShiftCode.R, name: ShiftName.R, hours: ShiftHours.R, color: "FFE880" },
    { code: ShiftCode.P, name: ShiftName.P, hours: ShiftHours.P, color: "B3E3FF" },
    { code: ShiftCode.L4, name: ShiftName.L4, hours: ShiftHours.L4, color: "EEB3B3" },
    { code: ShiftCode.U, name: ShiftName.U, hours: ShiftHours.U, color: "FFDBC3" },
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
            {shiftData.map((singleShiftData) => {
              return (
                <TableRow key={singleShiftData.code} className={classes.row}>
                  <TableCell className={classes.tableCell}>{singleShiftData.name}</TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {singleShiftData.hours}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {singleShiftData.code}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    <div
                      className={classes.colorSample}
                      style={{ backgroundColor: `#${singleShiftData.color}` }}
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
            ;
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
