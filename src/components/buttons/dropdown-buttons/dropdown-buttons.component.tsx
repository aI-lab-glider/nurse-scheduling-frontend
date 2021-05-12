/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { useRef, useState } from "react";
import { ButtonVariant } from "../../common-components";
import {
  Wrapper,
  PlaceholderButtonContent,
  PlaceholderButton,
  ButtonListWrapper,
  DropdownButton,
} from "./dropdown-buttons.styled";

export interface ButtonData {
  label: string;
  action: () => void;
  dataCy?: string;
}

interface DropdownOptions {
  buttons: ButtonData[];
  mainLabel: string;
  buttonVariant?: ButtonVariant;
  width: number;
  dataCy?: string;
  disabled?: boolean;
}

export function DropdownButtons({
  buttons,
  mainLabel,
  buttonVariant,
  width,
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

  // TODO: something is wrong here
  const dropdownZIndex = 100;

  return (
    <Wrapper>
      <PlaceholderButton
        variant={buttonVariant}
        onClick={handleToggle}
        ref={anchorRef}
        data-cy={dataCy}
        disabled={disabled}
        style={
          {
            zIndex: open ? dropdownZIndex + 1 : "initial",
            "--width": width,
          } as React.CSSProperties
        }
      >
        <PlaceholderButtonContent>
          <span>{mainLabel}</span>
          <div>
            <ArrowDropDownIcon />
          </div>
        </PlaceholderButtonContent>
      </PlaceholderButton>
      <Popper
        data-cy="openedDropdown"
        open={open}
        placement="bottom"
        anchorEl={anchorRef.current}
        disablePortal
        style={{
          zIndex: dropdownZIndex,
          width: `${width}px`,
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <ButtonListWrapper>
            {buttons.map((item) => (
              <DropdownButton
                key={item.label}
                onClick={(): void => {
                  item.action();
                  setOpen(false);
                }}
                data-cy={item.dataCy}
              >
                {item.label}
              </DropdownButton>
            ))}
          </ButtonListWrapper>
        </ClickAwayListener>
      </Popper>
    </Wrapper>
  );
}
