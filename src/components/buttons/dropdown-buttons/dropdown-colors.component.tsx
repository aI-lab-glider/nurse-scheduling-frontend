/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper from "@material-ui/core/Popper";
import classNames from "classnames/bind";
import { Button, ButtonVariant } from "../../common-components";

interface DropdownColorsOptions {
  shiftType: string;
  mainLabel: string;
  buttonVariant?: ButtonVariant;
  variant?: string;
  dataCy?: string;
  disabled?: boolean;
  colorClicker: (event: string) => void;
  selectedColor: string;
}

export function DropdownColors({
  shiftType,
  mainLabel,
  buttonVariant,
  variant,
  dataCy,
  disabled = false,
  colorClicker,
  selectedColor,
}: DropdownColorsOptions): JSX.Element {
  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const worksShiftsColors = [
    "FFD100",
    "73B471",
    "00A3FF",
    "1D3557",
    "641EAA",
    "FF77D9",
    "FFF849",
    "33FF00",
    "79E7FF",
    "FF003D",
    "B770FF",
    "FF00B8",
  ];
  const notWorksShiftsColors = ["FF8A00", "C60000", "000000", "D7D8DF", "C3A000", "007F87"];

  const [colorPicked, setLocalColor] = useState(selectedColor);

  function getChunckedColors(colorArrays: string[], chunkLen: number): string[][] {
    const result: string[][] = [];
    let i, j;

    for (i = 0, j = colorArrays.length; i < j; i += chunkLen) {
      result.push(colorArrays.slice(i, i + chunkLen));
    }
    return result;
  }

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
          <div>
            <div
              className={classNames("colorSample", "margin6px0")}
              style={{ backgroundColor: `#${colorPicked}` }}
            />
          </div>
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
            <div className="dropdown-buttons-container">
              <div>
                <>
                  <div className={"colorSampleHolderHolder"}>
                    {getChunckedColors(
                      shiftType === "working" ? worksShiftsColors : notWorksShiftsColors,
                      6
                    ).map((colorRow) => {
                      return (
                        <div className={"colorSampleHolder"}>
                          {colorRow.map((color) => {
                            return (
                              <>
                                <div
                                  className={classNames(
                                    "colorSample",
                                    "pointerCursor",
                                    "marginTop10px"
                                  )}
                                  onClick={(): void => {
                                    colorClicker(color);
                                    setLocalColor(color);
                                    handleClickAway();
                                  }}
                                  style={{ backgroundColor: `#${color}` }}
                                />
                              </>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
