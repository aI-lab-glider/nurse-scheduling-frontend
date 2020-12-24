import React from "react";
import { useState } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
export interface ScheduleFoldingSectionOptions {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export function ScheduleFoldingSection({
  name,
  children,
}: ScheduleFoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <tr className="middleSection">
        <td className="middleCell">
          <div className="sectionToggleHeader">
            <span onClick={(): void => setOpened((prev) => !prev)}>
              {opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            </span>
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
