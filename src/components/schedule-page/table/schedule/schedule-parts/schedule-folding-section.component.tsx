/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { ReactNode } from "react";
import { useState } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
interface ScheduleFoldingSectionOptions {
  name: string;
  children: ReactNode;
}
/**
 * Used only in schedule. For other use cases, use @see FoldingSection from  @module common-components
 */
export function ScheduleFoldingSection({
  name,
  children,
}: ScheduleFoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <tr className="foldingSection">
        <td>
          <div onClick={(): void => setOpened((prev) => !prev)} className="text">
            <span>{opened ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <span>{name}</span>
          </div>
        </td>
        <td colSpan={2}>
          <hr className="middle" />
        </td>
      </tr>
      {opened && children}
    </>
  );
}
