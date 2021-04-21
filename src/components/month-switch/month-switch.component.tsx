/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useActualMonth } from "../../hooks/use-actual-month";
import { MonthSwitchActionCreator } from "../../state/schedule-data/month-switch.action-creator";
import { IconButton } from "@material-ui/core";
import { AppMode, useAppConfig } from "../../state/app-config-context";
import styled from "styled-components";
import { colors, fontSizeLg, iconSizeSm } from "../../assets/colors";

interface MonthSwitchComponentOptions {
  isInViewMode: boolean;
}

export function MonthSwitchComponent({ isInViewMode }: MonthSwitchComponentOptions): JSX.Element {
  const [showMonthNavigation, setShowMonthNavigation] = useState(false);

  const actualMonth = useActualMonth();
  const dispatch = useDispatch();
  const { mode } = useAppConfig();
  useEffect(() => {
    mode === AppMode.SCHEDULE
      ? setShowMonthNavigation(isInViewMode)
      : setShowMonthNavigation(false);
  }, [mode, isInViewMode]);

  return (
    <>
      {actualMonth && (
        <Wrapper>
          {showMonthNavigation && (
            <IconWrapper
              data-cy="switch-prev-month"
              onClick={(): void => {
                dispatch(MonthSwitchActionCreator.switchToNewMonth(-1));
              }}
            >
              <MdChevronLeft />
            </IconWrapper>
          )}

          <MonthName>{actualMonth}</MonthName>

          {showMonthNavigation && (
            <IconWrapper
              data-cy="switch-next-month"
              onClick={(): void => {
                dispatch(MonthSwitchActionCreator.switchToNewMonth(1));
              }}
            >
              <MdChevronRight />
            </IconWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  margin: auto;

  * {
    color: ${colors.white};
  }
`;

const IconWrapper = styled(IconButton)`
  outline: none;
  font-size: ${iconSizeSm};
`;

const MonthName = styled.h2`
  margin: 5px;
  font-weight: 500;
  font-size: ${fontSizeLg};
  letter-spacing: 0.035em;
  width: 140px;
  text-align: center;
`;
