/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import styled from "styled-components";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { Button } from "../../../components/common-components";
import {
  NewShiftTemplate,
  ShiftEditComponentMode,
} from "../../../components/shifts-drawer/shift-edit-drawer.component";
import { Shift } from "../../../state/schedule-data/shifts-types/shift-types.model";

const useStyles = makeStyles(() =>
  createStyles({
    tableCellH: {
      fontWeight: "bolder",
      color: ScssVars.primary,
      padding: "0px",
    },
  })
);

interface EnhancedTableProps {
  toggleOpen: (shift: NewShiftTemplate, mode: ShiftEditComponentMode) => void;
}

interface ShiftDataCell {
  id: keyof Shift;
  label: string;
}

const headCells: ShiftDataCell[] = [
  { id: "name", label: "Nazwa zmiany" },
  { id: "from", label: "Godziny" },
  { id: "code", label: "Skrót" },
  { id: "color", label: "Kolor" },
];

export function EnhancedTableHeaderComponent(props: EnhancedTableProps): JSX.Element {
  const { toggleOpen } = props;
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell className={classes.tableCellH} key={headCell.id}>
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="right">
          <HeaderButton
            variant="primary"
            disabled
            onClick={(): void => {
              toggleOpen(
                {
                  name: "Nowa zmiana",
                  from: 0,
                  to: 0,
                  color: "FFD100",
                  isWorkingShift: true,
                },
                ShiftEditComponentMode.ADD_NEW
              );
            }}
          >
            Dodaj zmianę
          </HeaderButton>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const HeaderButton = styled(Button)`
  width: 187px;
`;
