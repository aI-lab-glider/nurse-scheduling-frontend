import React from "react";

export function EmptyRowComponent({ rowHeight = 20 }): JSX.Element {
  return <tr style={{ height: `${rowHeight}px` }}></tr>;
}
