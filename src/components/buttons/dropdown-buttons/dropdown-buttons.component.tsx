/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import React, { useRef, useState } from "react";
import AngleDown from "../../../assets/images/svg-components/AngleDown";
import Check from "../../../assets/images/svg-components/Check";
import { ButtonVariant } from "../../common-components";
import * as S from "./dropdown.styled";

export interface ButtonData {
  label: string;
  action: () => void;
  dataCy?: string;
}

interface DropdownOptions {
  buttons: ButtonData[];
  mainLabel: string;
  buttonVariant?: ButtonVariant;
  dataCy?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function DropdownButtons({
  buttons,
  mainLabel,
  buttonVariant,

  dataCy,
  disabled = false,
  style,
}: DropdownOptions): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  function handleToggle(): void {
    setOpen((prevVal) => !prevVal);
  }

  function handleClickAway(): void {
    setOpen(false);
  }

  const dropdownZIndex = 100;

  return (
    <>
      <S.PlaceholderButton
        variant={buttonVariant}
        onClick={handleToggle}
        ref={anchorRef}
        data-cy={dataCy}
        disabled={disabled}
        style={{
          borderRadius: 4,
          ...style,
          zIndex: open ? dropdownZIndex + 1 : "initial",
        }}
      >
        <S.PlaceholderButtonContent>
          <span>{mainLabel}</span>
          <AngleDown />
        </S.PlaceholderButtonContent>
      </S.PlaceholderButton>
      <Popper
        data-cy="openedDropdown"
        open={open}
        placement="bottom"
        anchorEl={anchorRef.current}
        disablePortal
        style={{
          width: style?.width || "auto",
          zIndex: dropdownZIndex,
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <S.ButtonListWrapper>
            {buttons.map((item) => (
              <S.ButtonRow>
                {mainLabel === item.label && (
                  <Check style={{ position: "absolute", left: "10px" }} />
                )}
                <S.DropdownButton
                  key={item.label}
                  onClick={(): void => {
                    item.action();
                    setOpen(false);
                  }}
                  data-cy={item.dataCy}
                >
                  {item.label}
                </S.DropdownButton>
              </S.ButtonRow>
            ))}
          </S.ButtonListWrapper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
