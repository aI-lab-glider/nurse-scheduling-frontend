/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { ReactNode } from "react";
import { useState } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
interface FoldingSectionOptions {
  name: string;
  children: ReactNode;
}

export function FoldingSection({ name, children }: FoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(true);
  return (
    <div className="foldingSection">
      <div className="header">
        <div onClick={(): void => setOpened((prev) => !prev)} className="text">
          <span>{opened ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
          <span>{name}</span>
        </div>
        <hr className="middle" />
      </div>
      {opened && children}
    </div>
  );
}
