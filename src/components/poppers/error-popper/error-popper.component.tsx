/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { ReactNode, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useDispatch, useSelector } from "react-redux";
import * as S from "./error-popper.styled";
import { ErrorMessageHelper } from "../../../helpers/error-message.helper";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { ScheduleDataActionCreator } from "../../../state/schedule-data/schedule-data.action-creator";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../state/schedule-data/schedule-errors/schedule-error.model";
import ErrorListItem from "../../error-list/error-list-item.component";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorPopperOptions {
  children: ReactNode;
  errorSelector: (scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
  className?: string;
  showErrorTitle?: boolean;
  id?: string;
  showTooltip?: boolean;
}

export function ErrorPopper({
  showErrorTitle,
  children,
  errorSelector,
  className,
  id,
}: ErrorPopperOptions): JSX.Element {
  const errors = useSelector((state: ApplicationStateModel) =>
    errorSelector(state.actualState.scheduleErrors)
  );
  const dispatch = useDispatch();

  const handleShow = (): void => {
    dispatch(ScheduleDataActionCreator.hideErrors());
  };
  let triangleStyle = "single";
  errors.forEach((error) => {
    // TODO: fix any
    triangleStyle = (error as any).className || triangleStyle;
  });
  const errorTriangle = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isToolTipOpen, setToolTipOpen] = useState(false);
  let isOpen = isToolTipOpen;
  const manuallySelectedErrors = errors.filter((error) => error.isVisible);
  if (manuallySelectedErrors.length !== 0) {
    isOpen =
      // TODO: fix any
      manuallySelectedErrors.some((e) => (e as any).className === "right") ||
      manuallySelectedErrors.every((e) => (e as any).className === undefined);
  }

  const { styles, attributes } = usePopper(
    container.current,
    isOpen && errors.length !== 0 ? tooltipRef.current : null,
    {
      placement: "right-start",
    }
  );
  const [isFixed, setIsFixed] = useState(false);

  function showErrorTooltip(): void {
    setToolTipOpen(true);
  }

  function hideErrorTooltip(ignoreFixed = false): void {
    if (manuallySelectedErrors.length !== 0) handleShow();
    if (!isFixed || (ignoreFixed && isFixed)) {
      setToolTipOpen(false);
      setIsFixed(false);
    }
  }

  const { shift_types: shiftTypes } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  return (
    <>
      <S.ErrorTooltip
        ref={tooltipRef}
        isOpen={isOpen}
        {...attributes.popper}
        style={{
          ...(isOpen && errors.length !== 0 ? styles.popper : {}),
          zIndex: 1000,
        }}
        onMouseLeave={(): void => hideErrorTooltip(false)}
      >
        {errors.map((error, index) => (
          <ErrorListItem
            index={index}
            key={`${error.kind}_${index}`}
            error={ErrorMessageHelper.getErrorMessage(error, shiftTypes)}
            interactable={false}
            showTitle={showErrorTitle}
          />
        ))}
      </S.ErrorTooltip>

      <div
        id={id}
        ref={container}
        className={className}
        style={{
          position: "relative",
        }}
        onMouseEnter={showErrorTooltip}
        onMouseLeave={(): void => hideErrorTooltip(false)}
      >
        {errors.length !== 0 && triangleStyle === "single" && (
          <S.ErrorTriangle ref={errorTriangle} />
        )}
        {errors.length !== 0 && triangleStyle === "right" && (
          <div>
            <S.ErrorLine ref={errorTriangle} />
            <S.RightBottomErrorTooltip ref={errorTriangle} />
          </div>
        )}
        {errors.length > 1 && <S.ErrorTriangle ref={errorTriangle} />}
        {errors.length !== 0 && triangleStyle === "middle" && <S.ErrorLine ref={errorTriangle} />}
        {errors.length !== 0 && triangleStyle === "left" && (
          <div>
            <S.ErrorLine ref={errorTriangle} />
            <S.LeftBottomErrorTooltip ref={errorTriangle} />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
