/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper from "@material-ui/core/Popper";
import { Button, ButtonVariant } from "..";

export interface ButtonData {
  label: string;
  action: () => void;
  dataCy?: string;
}

interface DropdownOptions {
  buttons: ButtonData[];
  mainLabel: string;
  buttonVariant?: ButtonVariant;
  variant?: string;
  dataCy?: string;
  disabled?: boolean;
}

export function DropdownButtons({
  buttons,
  mainLabel,
  buttonVariant,
  variant,
  dataCy,
  disabled = false,
}: DropdownOptions): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  function handleToggle(): void {
    setOpen((prevVal) => !prevVal);
  }

  function handleClickAway(): void {
    setOpen(false);
  }

  return (
    <div className="dropdown-container">
      <Button
        variant={buttonVariant}
        id={variant + "-onTopButton"}
        onClick={handleToggle}
        ref={anchorRef}
        data-cy={dataCy}
        disabled={disabled}
      >
        <div className="centeredButtonWithArrow">
          <div>{mainLabel}</div>
          <div>
            <ArrowDropDownIcon />
          </div>
        </div>
      </Button>
      <Popper
        data-cy="openedDropdown"
        open={open}
        placement="bottom"
        anchorEl={anchorRef.current}
        disablePortal
        className={"z-index100"}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="dropdown-buttons-list" id={variant}>
            {buttons.map((item) => (
              <div
                className="dropdown-button"
                key={item.label}
                onClick={(): void => {
                  item.action();
                  setOpen(false);
                }}
                data-cy={item.dataCy}
              >
                {item.label}
              </div>
            ))}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
