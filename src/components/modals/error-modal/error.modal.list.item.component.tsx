/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import styled from "styled-components";
import { colors } from "../../../assets/colors";
import { TranslationHelper } from "../../../helpers/translations.helper";
import { useMonthInfo } from "../../../hooks/use-month-info";
import { VerboseDate } from "../../../state/schedule-data/foundation-info/foundation-info.model";
import { ScheduleErrorMessageModel } from "../../../state/schedule-data/schedule-errors/schedule-error-message.model";

interface Options {
  error: ScheduleErrorMessageModel;
}

function prepareMonthName(index: number, day: number, month: number): string {
  let monthName = `${TranslationHelper.polishMonthsGenetivus[month]}`;

  if (index < day - 1) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 11) % 12]}`;
  } else if (index > 20 && day < 8) {
    monthName = `${TranslationHelper.polishMonthsGenetivus[(month + 1) % 12]}`;
  }
  return monthName;
}

export default function ModalErrorListItem({ error }: Options): JSX.Element {
  const { verboseDates, monthNumber } = useMonthInfo();
  const mappedDays = verboseDates.map((d: VerboseDate) => d.date);

  const errorDayIndex = error.day && error.day > 0 ? error.day : -1;
  const errorDay = errorDayIndex ? mappedDays[errorDayIndex - 1] : 0;
  const monthName = prepareMonthName(errorDayIndex, errorDay, monthNumber);

  const displayTitle = error.title && error.title !== "Nie rozpoznano błędu";
  return (
    <Wrapper>
      <RedBar />
      <div>
        {displayTitle && (
          <Title>
            {error.title === "date" ? `${errorDay} ${monthName}` : `${error.title}`}
            {errorDayIndex > -1 && error.title !== "date" ? `, ${errorDay} ${monthName}` : ""}
          </Title>
        )}
        <Content dangerouslySetInnerHTML={{ __html: error.message || "" }} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  border: 1px solid ${colors.errorListItemBorder};
  border-radius: 2px;
  margin: 0 24px 8px 24px;
`;

const RedBar = styled.div`
  border-radius: 4px;
  width: 4.5px;
  position: absolute;
  height: 100%;
  background-color: ${colors.errorRed};
  left: 0;
`;

const Title = styled.div`
  padding: 10px 0 0 25px;
  color: ${colors.errorDateText};
  size: 14px;
`;

const Content = styled.div`
  position: static;
  color: ${colors.primaryTextColor};
  size: 13px;
  margin: 10px;
  padding-left: 15px;
  text-align: justify;
  strong {
    letter-spacing: 1.5px;
    font-weight: bolder;
  }
`;
