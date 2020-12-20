import React from "react";
import Drawer, { DrawerOptions } from "../../common-components/drawer/drawer.component";

export enum ShiftDrawerMode {
  EDIT,
  ADD_NEW,
}

interface ShiftDrawerOptions extends Omit<DrawerOptions, "title"> {
  mode: ShiftDrawerMode;
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
  const { mode, setOpen, ...otherOptions } = options;
  const title = getTitle(mode);
  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions}>
      Drawer content
    </Drawer>
  );
}
