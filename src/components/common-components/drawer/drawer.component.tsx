import { Drawer as MaterialDrawer, DrawerProps, IconButton } from "@material-ui/core";
import { MdClose } from "react-icons/md";

import React from "react";

export interface DrawerOptions extends DrawerProps {
  title: string;
  setOpen: (open: boolean) => void;
}
export default function Drawer(options: DrawerOptions): JSX.Element {
  const { title, setOpen, children, ...otherOptions } = options;

  return (
    <MaterialDrawer {...otherOptions} anchor={"right"}>
      <h1>{title}</h1>
      <IconButton onClick={(): void => setOpen(false)}>
        <MdClose />
      </IconButton>
      {children}
    </MaterialDrawer>
  );
}
