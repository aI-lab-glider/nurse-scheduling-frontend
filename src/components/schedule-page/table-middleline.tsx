import React from "react";
import { useState } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
export interface FoldingSectionOptions {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export function FoldingSection({ name, children }: FoldingSectionOptions): JSX.Element {
  const [open, openC] = useState(true);
  return (
    <>
      <tr className="middleSection">
        <td className="middleCell">
          <span className="tick" onClick={(): void => openC((prev) => !prev)}>
            {open ? (
              <span>
                {" "}
                <ArrowLeftIcon />{" "}
              </span>
            ) : (
              <span>
                {" "}
                <ArrowRightIcon />{" "}
              </span>
            )}
          </span>
          <span>{name}</span>
        </td>
        <td colSpan={2}>
          <hr className="middle" />
        </td>
      </tr>
      {open && children}
    </>
  );
}
