import React, { ReactNode } from "react";
import { useState } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

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
          <span>{opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</span>
          <span>{name}</span>
        </div>
        <hr className="middle" />
      </div>
      {opened && children}
    </div>
  );
}
