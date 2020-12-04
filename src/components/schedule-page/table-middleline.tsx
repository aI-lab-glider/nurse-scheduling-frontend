import React from "react";

export interface TableMiddleLineOptions {
  name: string;
}

export function TableMiddleLine({ name }: TableMiddleLineOptions): JSX.Element {
  return (
    <tr className="middleSection">
      <td className="middleCell">
        <span>
          {name} <span className="tick">&#10093;</span>
        </span>
      </td>
      <td colSpan={2}>
        <hr className="middle" />
      </td>
    </tr>
  );
}
