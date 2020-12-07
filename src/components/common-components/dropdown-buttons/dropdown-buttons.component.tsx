import React, { useState, useRef } from "react";
import { Button } from "../button-component/button.component";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper from "@material-ui/core/Popper";

export interface ButtonData {
  label: string;
  action: () => void;
}

interface Options {
  buttons: ButtonData[];
  mainLabel: string;
}

export default function DropdownButtonsComponent({ buttons, mainLabel }: Options): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  function handleToggle(): void {
    setOpen((prevVal) => !prevVal);
  }

  function handleClickAway(): void {
    setOpen(false);
  }

  return (
    <div>
      <Button variant="primary" onClick={handleToggle} ref={anchorRef}>
        {mainLabel}
        <ArrowDropDownIcon />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current}>
        <div className="display-main-button">
          <Button variant="primary">
            {mainLabel}
            <ArrowDropDownIcon />
          </Button>
        </div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="dropdown-buttons-container">
            {buttons.map((item, index) => (
              <Button onClick={buttons[index].action}>{buttons[index].label}</Button>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
