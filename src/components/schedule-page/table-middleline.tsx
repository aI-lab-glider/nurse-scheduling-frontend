import React from "react";
import { useState } from "react";

export interface TableMiddleLineOptions {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export function TableMiddleLine({ name, children }: TableMiddleLineOptions): JSX.Element {
  const [open, openC] = useState(true);
  return (
    <>
      <tr className="middleSection">
        <td className="middleCell">
          <span className="tick" onClick={(): void => openC((prev) => !prev)}>
            {open ? <span> &#10095; </span> : <span> &#10094; </span>}
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
