import React, { useState, useRef } from "react";
import { Button, ButtonVariant } from "../button-component/button.component";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { shifts } from "../../../common-models/shift-info.model";
import { IconButton } from "@material-ui/core";

export interface ButtonData {
  label: string;
  action: () => void;
  dataCy?: string;
}

interface ColorSelectorOptions {
  buttons: ButtonData[];
  mainLabel: string;
  variant?: ButtonVariant;
  dataCy?: string;
  position?: PopperPlacementType;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "0 0 0 10px",
      width: "100%",
    },
    tableCell: {
      color: `black`,
      fontWeight: "normal",
      fontSize: ScssVars.fontSizeBase,
      fontFamily: ScssVars.fontFamilyPrimary,
      letterSpacing: ScssVars.headingLetterSpacing,
      textAlign: "left",
      padding: "0 0 0 0",
    },
    row: {
      borderTop: `2px solid ${ScssVars.workerTableBorderColor}`,
    },
    colorSample: {
      width: "18px",
      height: "18px",
      borderRadius: "24px",
      border: `2px solid ${ScssVars.primary}`,
    },
  })
);

export function ColorSelector(
  this: any,
  { buttons, mainLabel, variant, dataCy, position }: ColorSelectorOptions
): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();

  const worksShifts = Object.values(shifts).filter((shift) => shift.isWorkingShift);
  const notWorksShifts = Object.values(shifts).filter((shift) => !shift.isWorkingShift);

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
              <p>pracującę</p>
              <div className={"shifts-colors"}>
                {Object.values(worksShifts).map((shift, index) => {
                  return (
                    <>
                      {index !== 0 && index % 6 === 0 && <br>&nbsp;</br>}
                      <IconButton className={"color-button"} size={"small"}>
                        <div
                          className={classes.colorSample}
                          style={{ backgroundColor: `#${shift.color}` }}
                        />
                      </IconButton>
                    </>
                  );
                })}
              </div>
              <p>niepracującę</p>
              <div className={"shifts-colors"}>
                {Object.values(notWorksShifts).map((shift, index) => {
                  return (
                    <>
                      {index !== 0 && index % 6 === 0 && <br />}
                      <IconButton className={"color-button"} size={"small"}>
                        <div
                          className={classes.colorSample}
                          style={{ backgroundColor: `#${shift.color}` }}
                        />
                      </IconButton>
                    </>
                  );
                })}
              </div>
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
