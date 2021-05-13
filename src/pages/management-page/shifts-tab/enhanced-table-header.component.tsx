/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import * as S from "./enhanced-table-header.styled";
import { ShiftDrawerMode } from "../../../components/shifts-drawer/shift-drawer.component";
import { Shift, ShiftCode } from "../../../state/schedule-data/shifts-types/shift-types.model";

interface EnhancedTableProps {
  toggleOpen: (shift: Shift, mode: ShiftDrawerMode) => void;
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

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <S.StyledTableCell key={headCell.id}>{headCell.label}</S.StyledTableCell>
        ))}
        <TableCell align="right">
          <S.HeaderButton
            variant="primary"
            disabled
            onClick={(): void => {
              toggleOpen(
                {
                  code: "" as ShiftCode, // TODO: fix typing
                  name: "Nowa zmiana",
                  from: 0,
                  to: 0,
                  color: "FFD100",
                  isWorkingShift: true,
                },
                ShiftDrawerMode.ADD_NEW
              );
            }}
          >
            Dodaj zmianę
          </S.HeaderButton>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
