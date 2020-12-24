import React, { ReactNode } from "react";
import { useState } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
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
            <span>{opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</span>
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
