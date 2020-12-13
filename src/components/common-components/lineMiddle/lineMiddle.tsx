import React from "react";
import { useState } from "react";

interface LineMiddleOptions {
  component: JSX.Element | JSX.Element[];
}

export function LineMiddle({ component }: LineMiddleOptions): JSX.Element {
  const [open, openC] = useState(true);
  return (
    <>
      <span className="tick" onClick={(): void => openC((prev) => !prev)}>
        {open ? <span> &#10095; </span> : <span> &#10094; </span>}
      </span>
      {open && component}
    </>
  );
}
