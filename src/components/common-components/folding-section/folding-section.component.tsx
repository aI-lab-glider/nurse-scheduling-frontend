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
/**
 * @description Function component which provides collapsing functionaliny for underlying children elements
 * @param name - section name
 * @param children - children elements
 * @returns JSX.Element
 */
export function FoldingSection({ name, children }: FoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(false);
  return (
    <div className="foldingSection">
      <div className="header">
        <div
          onClick={(): void => setOpened((prev) => !prev)}
          className="text"
          data-cy="open-folding-section"
        >
          <span>{opened ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
          <span>{name}</span>
        </div>
        <hr className="middle" />
      </div>
      <div style={{ height: opened ? "initial" : "none" }}>{children}</div>
    </div>
  );
}
