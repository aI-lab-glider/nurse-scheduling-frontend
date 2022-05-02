/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DrawerProps } from "@material-ui/core";
import React from "react";
import * as S from "./drawer-header.styled";

export interface DrawerHeaderOptions extends DrawerProps {
  title: string;
  setOpen: (open: boolean) => void;
}

export default function DrawerHeader(options: DrawerHeaderOptions): JSX.Element {
  const { title, setOpen, children } = options;

  return (
    <>
      <S.FullHeightBox>{children}</S.FullHeightBox>
    </>
  );
}
