/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useEffect } from "react";
import * as S from "./styled";
import classNames from "classnames/bind";
import {
  VerboseDate,
  WeekDay,
} from "../../../../state/schedule-data/foundation-info/foundation-info.model";
import {
  AlgorithmErrorCode,
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import { TranslationHelper } from "../../../../helpers/translations.helper";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";
import { colors, fontSizeBase, fontWeightBase, fontWeightBold } from "../../../../assets/colors";

export interface TimeTableCellOptions {
  value: VerboseDate;
  currMonth: number;
  index: number;
}

function TimeTableCellF({ value, currMonth, index }: TimeTableCellOptions): JSX.Element {
  function getHeaderClass(): string {
    if (value.month !== TranslationHelper.englishMonths[currMonth]) {
      return "otherMonth";
    }
    if (value.isPublicHoliday || value.dayOfWeek === WeekDay.SA || value.dayOfWeek === WeekDay.SU) {
      return "weekend";
    }
    return "";
  }
  const [today, setToday] = React.useState<boolean>(false);

  useEffect(() => {
    const today = new Date();
    setToday(
      value.month === TranslationHelper.englishMonths[today.getMonth()] &&
        value.date === today.getDate()
    );
  }, [value]);

  const errorSelector = useCallback(
    (scheduleErrors: GroupedScheduleErrors): ScheduleError[] => {
      const matchingErrorTypes = [
        ...(scheduleErrors[AlgorithmErrorCode.WorkerNumberDuringDay] ?? []),
        ...(scheduleErrors[AlgorithmErrorCode.WorkerNumberDuringNight] ?? []),
        ...(scheduleErrors[AlgorithmErrorCode.AlwaysAtLeastOneNurse] ?? []),
        ...(scheduleErrors[AlgorithmErrorCode.WorkerTeamsCollision] ?? []),
      ];
      return matchingErrorTypes.filter((error) => error.day === index);
    },
    [index]
  );

  return (
    <Wrapper className={getHeaderClass()}>
      <Popper errorSelector={errorSelector}>
        <DayName>{TranslationHelper.weekDaysTranslations[value.dayOfWeek]}</DayName>
        <DayMarker className={classNames({ today })}>
          <span>{value.date}</span>
        </DayMarker>
      </Popper>
    </Wrapper>
  );
}

export const TimeTableCell: React.FC<TimeTableCellOptions> = React.memo(
  TimeTableCellF,
  (prev, next) => prev.value === next.value
);

const Wrapper = styled.div`
  width: 100%;
  border-left: 1px solid ${colors.tableBorderGrey};
  color: ${colors.tableColor};
  background: ${colors.currMonthBackground};

  &:first-child {
    border-left: none;
  }

  &.weekend {
    background: ${colors.weekendHeader};
  }
  &.otherMonth {
    opacity: 0.5;
  }
`;

const Popper = styled(ErrorPopper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  height: 75px;
  padding-top: 30%;
`;

const DayName = styled.span`
  color: ${colors.primary};
  font-size: ${fontSizeBase};
  font-weight: ${fontWeightBase};
`;

const DayMarker = styled.div`
  color: ${colors.primary};
  font-size: ${fontSizeBase};
  font-weight: ${fontWeightBold};
  text-align: center;

  &.today {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    background: ${colors.primary};
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      color: ${colors.white};
      text-align: center;
    }
  }
`;
