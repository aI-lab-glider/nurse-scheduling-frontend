import React, { useState, useRef } from "react";
import { Button, ButtonVariant } from "../button-component/button.component";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";

export interface ButtonData {
  label: string;
  action: () => void;
  dataCy?: string;
}

interface DropdownOptions {
  buttons: ButtonData[];
  mainLabel: string;
  variant?: ButtonVariant;
  dataCy?: string;
  position?: PopperPlacementType;
}

export function DropdownButtons(
  this: any,
  { buttons, mainLabel, variant, dataCy, position }: DropdownOptions
): JSX.Element {
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
      <Button variant={variant} onClick={handleToggle} ref={anchorRef} data-cy={dataCy}>
        {mainLabel}
        <ArrowDropDownIcon />
      </Button>
      <Popper
        open={open}
        placement={position}
        className={`position-${position}`}
        anchorEl={anchorRef.current}
      >
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
              <Button key={item.label} onClick={item.action} data-cy={item.dataCy}>
                {item.label}
              </Button>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
