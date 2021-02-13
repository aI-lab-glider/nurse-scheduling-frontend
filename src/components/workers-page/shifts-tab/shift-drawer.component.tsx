/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import Drawer, { DrawerOptions } from "../../common-components/drawer/drawer.component";
import ShiftEditDrawer from "./shift-edit-drawer.component";
import { Shift } from "../../../common-models/shift-info.model";

export enum ShiftDrawerMode {
  EDIT,
  ADD_NEW,
}

interface ShiftDrawerOptions extends Omit<DrawerOptions, "title"> {
  mode: ShiftDrawerMode;
  selectedShift: Shift;
  saveChangedShift: (Shift) => void;
}

function getTitle(mode: ShiftDrawerMode): string {
  switch (mode) {
    case ShiftDrawerMode.EDIT:
      return "Edycja zmiany";
    case ShiftDrawerMode.ADD_NEW:
      return "Dodaj zmianę";
  }
}

export default function ShiftDrawerComponent(options: ShiftDrawerOptions): JSX.Element {
  const { mode, selectedShift, saveChangedShift, setOpen, ...otherOptions } = options;
  const title = getTitle(mode);
  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions}>
      <ShiftEditDrawer selectedShift={selectedShift} saveChangedShift={saveChangedShift} />
    </Drawer>
  );
}
