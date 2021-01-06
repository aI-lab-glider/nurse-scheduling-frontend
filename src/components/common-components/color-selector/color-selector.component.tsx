import React, { useState, useRef } from "react";
import { Button, ButtonVariant } from "../button-component/button.component";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { shifts } from "../../../common-models/shift-info.model";
import { IconButton } from "@material-ui/core";

interface ColorSelectorOptions {
  shiftType: string;
  mainLabel: string;
  variant?: ButtonVariant;
  position?: PopperPlacementType;
  colorClicker: any;
}

const useStyles = makeStyles(() =>
  createStyles({
    colorSample: {
      width: "18px",
      height: "18px",
      borderRadius: "24px",
      border: `2px solid ${ScssVars.primary}`,
    },
  })
);

export function ColorSelector({
  shiftType,
  mainLabel,
  variant,
  position,
  colorClicker,
}: ColorSelectorOptions): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();

  const worksShifts = [
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
  const notWorksShifts = ["FF8A00", "C60000", "000000", "FFFFFF", "C3A000", "007F87"];

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
      <Popper
        open={open}
        placement={position}
        modifiers={{
          offset: {
            enabled: true,
            offset: "-1, -40",
          },
        }}
        className={`position`} //-${position}
        anchorEl={anchorRef.current}
      >
        <div
          className={`${
            variant === "outlined" ? "display-main-button-outlined" : "display-main-button"
          }`}
        ></div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="dropdown-buttons-container">
            <div className={"colors"}>
              {shiftType === "working" && (
                <>
                  <p>pracującę</p>
                  <div className={"shifts-colors"}>
                    {worksShifts.map((color, index) => {
                      return (
                        <>
                          {index !== 0 && index % 6 === 0 && <br />}
                          <IconButton className={"color-button"} size={"small"}>
                            <div
                              className={classes.colorSample}
                              onClick={(): void => colorClicker(color)}
                              style={{ backgroundColor: `#${color}` }}
                            />
                          </IconButton>
                        </>
                      );
                    })}
                  </div>
                </>
              )}
              {shiftType === "not_working" && (
                <>
                  <p>niepracującę</p>
                  <div className={"shifts-colors"}>
                    {notWorksShifts.map((color, index) => {
                      return (
                        <>
                          {index !== 0 && index % 6 === 0 && <br />}
                          <IconButton className={"color-button"} size={"small"}>
                            <div
                              className={classes.colorSample}
                              onClick={(): void => colorClicker(color)}
                              style={{ backgroundColor: `#${color}` }}
                            />
                          </IconButton>
                        </>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </ClickAwayListener>
        <Button variant={variant} className={"button-helper"}>
          {mainLabel}
          <ArrowDropDownIcon />
        </Button>
      </Popper>
    </div>
  );
}
