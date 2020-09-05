import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionModel, ScheduleDataModel } from "../../../state/models";
import { useScheduleConverter } from "./hooks/useScheduleConverter";
import { ImportButtonsActionType } from "./models/import-buttons-action-type.enum";

function ImportButtonsComponent() {
  //#region members
  const [open, setOpen] = useState(false);
  const [content, setSrcFile] = useScheduleConverter();
  const anchorRef = useRef(null);

  //#endregion

  //#region effects
  const scheduleDipatcher = useDispatch();
  useEffect(() => {
    console.log(content);
    scheduleDipatcher({
      type: ImportButtonsActionType.IMPORT,
      payload: content,
    } as ActionModel<ScheduleDataModel>);
  }, [content, scheduleDipatcher]);
  //#endregion

  //#region logic
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleToggle = () => {
    setOpen((prevVal) => !prevVal);
  };
  //#endregion

  // #region view
  return (
    <React.Fragment>
      <Button onClick={() => handleToggle()} ref={anchorRef}>
        File
        <ArrowDropDownIcon />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current}>
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
          }}
        >
          <ButtonGroup orientation="vertical">
            <Button component="label">
              Select a file
              <input
                onChange={(event) => handleImport(event)}
                style={{ display: "none" }}
                type="file"
              />
            </Button>

            <Button onClick={() => handleExport()}>Save file as ...</Button>
          </ButtonGroup>
        </ClickAwayListener>
      </Popper>
    </React.Fragment>
  );
  // #endregion
}

export default ImportButtonsComponent;
