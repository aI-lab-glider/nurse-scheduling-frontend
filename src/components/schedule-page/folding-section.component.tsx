import React from "react";
import { useState } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
export interface FoldingSectionOptions {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export function FoldingSection({ name, children }: FoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <div className="toggle">
        {/* <tr className="middleSection">
        <td className="middleCell"> */}
        <span onClick={(): void => setOpened((prev) => !prev)}>
          {opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </span>
        <span>{name}</span>
        {/* </td> */}
        {/* <td colSpan={2}> */}
        <hr className="middle" />
        {/* </td>
      </tr> */}
      </div>
      {opened && children}
    </>
  );
}
