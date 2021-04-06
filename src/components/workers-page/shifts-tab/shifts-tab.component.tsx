/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { Shift } from "../../../common-models/shift-info.model";
import { Button } from "../../common-components";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import ShiftDrawerComponent, { ShiftDrawerMode } from "./shift-drawer.component";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleDataActionCreator } from "../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ShiftsActionCreator } from "../../../state/reducers/shifts.action-creator";
import { ParserHelper } from "../../../helpers/parser.helper";

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
  const [selectedShift, setShift] = useState(Object);
  const shiftData = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );

  function toggleOpen(shift: Shift, mode: ShiftDrawerMode): void {
    setShift(shift);
    setMode(mode);
    setIsOpen(true);
  }

  function toggleClose(): void {
    setIsOpen(false);
  }
  const dispatcher = useDispatch();
  const handleChangeItem = (createdShift: Shift): void => {
    if (!ParserHelper.shiftPasses7am(createdShift)) {
      if (mode === ShiftDrawerMode.ADD_NEW) {
        dispatcher(ScheduleDataActionCreator.addNewShift(createdShift));
      } else {
        dispatcher(ScheduleDataActionCreator.modifyShift(createdShift, selectedShift));
      }

      toggleClose();
    } else {
      console.log("error error co teraz?");
    }
  };

  const handleRemoveItem = (shift: Shift): void => {
    dispatcher(ScheduleDataActionCreator.deleteShift(shift));
    dispatcher(ShiftsActionCreator.deleteShift(shift));
  };

  return (
    <div className="workers-table">
      <TableContainer className={classes.root}>
        <Table size="small">
          <EnhancedTableHeaderComponent toggleOpen={toggleOpen} />
          <TableBody>
            {Object.values(shiftData).map((shift) => {
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
                      onClick={(): void => toggleOpen(shift, ShiftDrawerMode.EDIT)}
                      disabled
                    >
                      Edytuj
                    </Button>
                    <Button
                      variant="secondary"
                      className="action-button"
                      onClick={(): void => handleRemoveItem(shift)}
                      disabled
                    >
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
        onClose={(): void => toggleClose()}
        mode={mode}
        setOpen={setIsOpen}
        selectedShift={selectedShift}
        saveChangedShift={handleChangeItem}
      />
    </div>
  );
}
