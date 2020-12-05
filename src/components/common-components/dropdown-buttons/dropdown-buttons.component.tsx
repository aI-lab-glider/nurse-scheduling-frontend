import React from "react";
import { Button } from "../button-component/button.component";

export interface ButtonData {
  label: string;
  action: () => void;
}

export default function DropdownButtonsComponent(btnData: ButtonData[]): JSX.Element {
  return (
    <div>
      <ul>
        {btnData.map((item, index) => (
          <li>
            <Button variant="secondary" onClick={btnData[index].action}>
              {btnData[index].label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
