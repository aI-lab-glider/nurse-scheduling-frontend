/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { Button } from "../../../components/common-components";
import ShiftDrawerComponent, {
  ShiftDrawerMode,
} from "../../../components/shifts-drawer/shift-drawer.component";
import { ParserHelper } from "../../../helpers/parser.helper";
import { ScheduleDataActionCreator } from "../../../state/schedule-data/schedule-data.action-creator";
import { Shift } from "../../../state/schedule-data/shifts-types/shift-types.model";
import { ShiftsActionCreator } from "../../../state/schedule-data/shifts-types/shifts.action-creator";
import { EnhancedTableHeaderComponent } from "./enhanced-table-header.component";
import { fontSizeXs } from "../../../assets/colors";
import { getPresentShiftTypes } from "../../../state/schedule-data/selectors";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "0 0 0 10px",
      width: "100%",
    },
    tableCell: {
      color: "black",
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
  const shiftData = useSelector(getPresentShiftTypes);

  function toggleOpen(shift: Shift, newMode: ShiftDrawerMode): void {
    setShift(shift);
    setMode(newMode);
    setIsOpen(true);
  }

  function toggleClose(): void {
    setIsOpen(false);
  }
  const dispatcher = useDispatch();
  const handleChangeItem = (createdShift: Shift): void => {
    if (!ParserHelper.shiftPassesDayStart(createdShift)) {
      if (mode === ShiftDrawerMode.ADD_NEW) {
        dispatcher(ScheduleDataActionCreator.addNewShift(createdShift));
      } else {
        dispatcher(ScheduleDataActionCreator.modifyShift(createdShift, selectedShift));
      }

      toggleClose();
    } else {
      throw Error("Shift cannot pass day start");
    }
  };

  const handleRemoveItem = (shift: Shift): void => {
    dispatcher(ScheduleDataActionCreator.deleteShift(shift));
    dispatcher(ShiftsActionCreator.deleteShift(shift));
  };

  return (
    <Wrapper>
      <TableContainer className={classes.root}>
        <Table size="small">
          <EnhancedTableHeaderComponent toggleOpen={toggleOpen} />
          <TableBody>
            {Object.values(shiftData).map((shift) => (
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
                  <ActionButton
                    variant="primary"
                    onClick={(): void => toggleOpen(shift, ShiftDrawerMode.EDIT)}
                    disabled
                  >
                    Edytuj
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={(): void => handleRemoveItem(shift)}
                    disabled
                  >
                    Usuń
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 45px;
`;

const ActionButton = styled(Button)`
  font-size: ${fontSizeXs};
  padding: 2px 25px 2px;
`;
