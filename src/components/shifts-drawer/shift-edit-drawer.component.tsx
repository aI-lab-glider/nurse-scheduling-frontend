/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import DateFnsUtils from "@date-io/date-fns";
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import i18next from "i18next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { colors, fontSizeBase, fontWeightExtra } from "../../assets/colors";
import { AcronymGenerator } from "../../helpers/acronym-generator.helper";
import { t } from "../../helpers/translations.helper";
import { getPresentShiftTypes } from "../../state/schedule-data/selectors";
import { Shift, ShiftCode } from "../../state/schedule-data/shifts-types/shift-types.model";
import { DropdownColors } from "../buttons/dropdown-buttons/dropdown-colors.component";
import { Button } from "../common-components";
import { ShiftDrawerMode } from "./shift-drawer.component";

interface ShiftEditDrawerOptions {
  selectedShift: Shift;
  saveChangedShift: (Shift) => void;
  mode: ShiftDrawerMode;
}

export default function ShiftEditDrawer({
  selectedShift,
  saveChangedShift,
  mode,
}: ShiftEditDrawerOptions): JSX.Element {
  const shifts = useSelector(getPresentShiftTypes);
  const shiftNames = Object.values(shifts).map((shift) => shift.name);
  const shiftCodes = Object.values(shifts).map((shift) => shift.code);
  const [shiftName, setShiftName] = useState(selectedShift.name);
  const [shiftCode, setShiftCode] = useState(selectedShift.code);

  const [isInShiftNames, setIsInShiftNames] = useState(false);
  const [isInShiftCodes, setIsInShiftCodes] = useState(false);
  const [isCodeManuallyChanged, setCodeManuallyChanged] = useState(false);

  const shiftNameTextFieldOnChange = (shiftNameActual: string): void => {
    setShiftName(shiftNameActual);
    !isCodeManuallyChanged && setShiftCode(AcronymGenerator.generate(shiftNameActual, shifts));
    setIsInShiftNames(shiftNames.includes(shiftNameActual));
  };

  const [shiftType, setShiftType] = useState(
    selectedShift.isWorkingShift ? "working" : "not_working"
  );

  function getButtonLabel(mode: ShiftDrawerMode): string {
    switch (mode) {
      case ShiftDrawerMode.EDIT:
        return i18next.t("shiftEdit");
      case ShiftDrawerMode.ADD_NEW:
        return i18next.t("shiftAdd");
      default:
        throw Error(`Invalid drawer mode ${mode}`);
    }
  }

  function changeShiftType(newShiftType: string): void {
    setShiftType(newShiftType);

    onChangeTimeStart(getNewDate());
    onChangeTimeEnd(getNewDate());

    if (newShiftType === "working") {
      setPicked("FFD100");
    } else {
      setPicked("FF8A00");
    }
  }

  function getNewDate(dateType?: string): Date {
    const newDate = new Date();
    switch (dateType) {
      case "start":
        newDate.setHours(selectedShift.from, 0, 0, 0);
        break;
      case "end":
        newDate.setHours(selectedShift.to, 0, 0, 0);
        break;
      default:
        newDate.setHours(0, 0, 0, 0);
        break;
    }

    return newDate;
  }

  const [valueTimeStart, onChangeTimeStart] = useState<Date | null>(getNewDate("start"));
  const [valueTimeEnd, onChangeTimeEnd] = useState<Date | null>(getNewDate("end"));

  const [colorPicked, setPicked] = useState(selectedShift.color);

  return (
    <Grid container direction="column" justify="space-between">
      <Grid item>
        <FormLabel>{t("shiftName")}</FormLabel>
        <TextField
          type="text"
          placeholder={selectedShift.name}
          onChange={(event): void => shiftNameTextFieldOnChange(event.target.value)}
          helperText={isInShiftNames ? t("shiftAlreadyExists") : ""}
          error={isInShiftNames}
        />

        <br />

        <FormLabel>{t("shiftType")}</FormLabel>
        <FormControl component="fieldset">
          <RadioGroupStyled
            row
            aria-label="shiftType"
            name="shiftType"
            value={shiftType}
            onChange={(event): void => changeShiftType(event.target.value)}
          >
            <FormControlLabel value="working" control={<StyledRadio />} label={t("workingShift")} />
            <FormControlLabel
              value="not_working"
              control={<StyledRadio />}
              label={t("notWorkingShift")}
            />
          </RadioGroupStyled>
        </FormControl>
        <br />

        <FormLabel>{t("shiftHours")}</FormLabel>
        <TimeRange>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              disabled={shiftType === "not_working"}
              label=""
              placeholder="00:00"
              ampm={false}
              value={valueTimeStart}
              onChange={onChangeTimeStart}
              openTo="hours"
              views={["hours"]}
            />
            <Dash>&ndash;</Dash>
            <TimePicker
              disabled={shiftType === "not_working"}
              label=""
              placeholder="00:00"
              ampm={false}
              value={valueTimeEnd}
              onChange={onChangeTimeEnd}
              openTo="hours"
              views={["hours"]}
            />
          </MuiPickersUtilsProvider>
        </TimeRange>
        <br />

        <FormLabel>{t("shiftShort")}</FormLabel>
        <TextField
          type="text"
          placeholder="Skrót"
          value={shiftCode}
          onChange={(event): void => {
            setShiftCode(event.target.value as ShiftCode); // TODO: fix typing if possible
            setIsInShiftCodes(shiftCodes.includes(event.target.value as ShiftCode)); // TODO: fix typing if possible
            setCodeManuallyChanged(true);
          }}
          helperText={isInShiftCodes ? t("shiftWithThatColorExist") : ""}
          error={isInShiftCodes}
        />
        <br />

        <FormLabel>{t("shiftColor")}</FormLabel>

        <DropdownWrapper>
          <DropdownColors
            shiftType={shiftType}
            mainLabel={t("selectColor")}
            buttonVariant="secondary"
            colorClicker={setPicked}
            selectedColor={colorPicked}
            width={200}
          />
        </DropdownWrapper>
      </Grid>
      <Grid item>
        <Button
          variant="primary"
          onClick={(): void => {
            saveChangedShift({
              code: shiftCode,
              name: shiftName,
              from: valueTimeStart?.getHours() ?? 0,
              to: valueTimeEnd?.getHours() ?? 0,
              color: colorPicked,
              isWorkingShift: shiftType === "working",
            });
          }}
          style={{ marginLeft: 0 }}
        >
          {getButtonLabel(mode)}
        </Button>
      </Grid>
    </Grid>
  );
}

const FormLabel = styled.h4`
  font-weight: 700;
  font-size: ${fontSizeBase};
  color: ${colors.primary};
`;

const TimeRange = styled.div`
  * {
    display: inline-flex;
  }
`;

const Dash = styled.p`
  font-weight: ${fontWeightExtra};
  font-size: ${fontSizeBase};
  color: ${colors.gray700};
  margin-left: 10px;
  margin-right: 10px;
`;

const RadioGroupStyled = styled(RadioGroup)`
  color: ${colors.primary};
  fill: ${colors.primary};

  &:hover {
    background-color: ${colors.gray100};
  }
`;

const StyledRadio = styled(Radio)`
  color: ${colors.primary};
`;

const DropdownWrapper = styled.div`
  margin-left: -10px;
`;
