import React from "react";
import { useState } from "react";

interface LineMiddleOptions {
  component: JSX.Element | JSX.Element[];
}
/*
export function LineMiddle({component}: LineMiddleOptions){
    console.log(component)
    const[open,openC]= useState(true)
    return <div>
        <button onClick={() => openC(prev =>  !prev)}>
            {open ? <span>&#10093;</span> :<span>&#10092;</span>}
        </button>
        {open && component}
    </div>
        <LineMiddle component={<span style={{color: 'black'}}> "sectionContainer" </span>}/>
}*/

export function LineMiddle({ component }: LineMiddleOptions): JSX.Element {
  console.log(component);
  const [open, openC] = useState(true);
  return (
    <span>
      <span className="tick" onClick={() => openC((prev) => !prev)}>
        {open ? <span> &#10095; </span> : <span> &#10094; </span>}
      </span>
      {open && component}
    </span>
  );
}
