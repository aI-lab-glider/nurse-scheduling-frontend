import React from "react";

export function EmptyRowComponent({ rowHeight = 20 }) {
  return <tr style={{ height: `${rowHeight}px` }}></tr>;
}
