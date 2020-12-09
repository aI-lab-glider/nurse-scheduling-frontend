import React, { useState, useRef } from "react";
import { Button, ButtonVariant } from "../button-component/button.component";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper from "@material-ui/core/Popper";

export interface ButtonData {
  label: string;
  action: () => void;
}

interface DropdownOptions {
  buttons: ButtonData[];
  mainLabel: string;
  variant?: ButtonVariant;
}

export function DropdownButtons({ buttons, mainLabel, variant }: DropdownOptions): JSX.Element {
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
      <Button variant={variant} onClick={handleToggle} ref={anchorRef}>
        {mainLabel}
        <ArrowDropDownIcon />
      </Button>
      <Popper open={open} placement="bottom" anchorEl={anchorRef.current}>
        <div
          className={`${
            variant === "outlined" ? "display-main-button-outlined" : "display-main-button"
          }`}
        >
          <Button variant={variant}>
            {mainLabel}
            <ArrowDropDownIcon />
          </Button>
        </div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="dropdown-buttons-container">
            {buttons.map((item) => (
              <Button onClick={item.action}>{item.label}</Button>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
