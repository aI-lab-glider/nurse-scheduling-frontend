/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React from "react";
import styled from "styled-components";
import { colors, fontSizeXs } from "../../../../assets/colors";
import { ScheduleError } from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";
import { useCellBackgroundHighlight } from "../../hooks/use-cell-highlight";
import { useCellSelection } from "../../hooks/use-cell-selection";
import { BaseCellInputComponent } from "./base-cell-input.component";
import { baseCellDataCy, BaseCellOptions } from "./base-cell.models";
import { CellInput } from "./cell-blockable-input.component";

export function BaseCellComponent(options: BaseCellOptions): JSX.Element {
  const {
    cellIndex,
    value,
    isBlocked,
    isSelected,
    isPointerOn,
    onClick,
    onBlur,
    errorSelector = (): ScheduleError[] => [],
  } = options;

  const selectableItemRef = useCellSelection(options);
  const backgroundHighlight = useCellBackgroundHighlight(options);

  const showInput = isPointerOn && !isBlocked;
  //  #region view
  return (
    <Wrapper
      ref={selectableItemRef}
      className={classNames(backgroundHighlight, { selection: isSelected, blocked: isBlocked })}
      onBlur={onBlur}
    >
      <Popper errorSelector={errorSelector} showTooltip={!showInput}>
        <ContentWrapper
          onClick={(): void => {
            if (!isBlocked) onClick?.();
          }}
        >
          <CellInput input={BaseCellInputComponent} {...options} isVisible={showInput} />

          {!showInput && (
            <CellWrapper>
              <CellValue data-cy={baseCellDataCy(cellIndex, "cell")}>{value}</CellValue>
            </CellWrapper>
          )}
        </ContentWrapper>
      </Popper>
    </Wrapper>
  );
  // #endregion
}

const Wrapper = styled.div`
  flex: 1 1 auto;
  border-left: 1px solid ${colors.tableBorderGrey};
  align-items: center;
  width: 120%;
  height: 100%;
  cursor: cell;
  padding: 0;
  overflow: hidden;
  color: ${colors.tableColor};
  background: ${colors.white};

  &:first-child {
    border-left: 0;
  }

  &.weekend {
    background: ${colors.weekendHeader};
  }

  &.otherMonth {
    background: ${colors.cellOtherMonthBackgroundColor};
    color: ${colors.gray600};
  }
`;

const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 4px 0 4px 0;
`;

const Popper = styled(ErrorPopper)`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

const CellWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

const CellValue = styled.p`
  display: flex;
  flex-direction: row;
  margin: auto;
  font-size: ${fontSizeXs};
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.75px;
  text-align: center;
  left: -2px;

  min-width: 10px;
  min-height: 10px;
  position: relative;
`;
