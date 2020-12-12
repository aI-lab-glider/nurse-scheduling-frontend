import React from "react";
import { LineMiddle } from "../common-components/lineMiddle/lineMiddle";
export interface TableMiddleLineOptions {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export function TableMiddleLine({ name, children }: TableMiddleLineOptions): JSX.Element {
  return (
    <tr className="middleSection">
      <td className="middleCell">
        <span>
          {name} <LineMiddle component={children} />
        </span>
      </td>
      <td colSpan={2}>
        <hr className="middle" />
      </td>
    </tr>
  );
}
