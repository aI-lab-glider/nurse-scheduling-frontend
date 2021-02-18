/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { ReactNode, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../common-models/schedule-error.model";
import { ErrorMessageHelper } from "../../../../../helpers/error-message.helper";
import { ApplicationStateModel } from "../../../../../state/models/application-state.model";
import ErrorListItem from "../../../validation-drawer/error-list-item.component";
import { Popper } from "./base-cell/popper";

export interface ErrorTooltipOptions {
  children: ReactNode;
  errorSelector: (scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
  className?: string;
  showErrorTitle?: boolean;
}

export function ErrorTooltipProvider({
  showErrorTitle,
  children,
  errorSelector,
  className,
}: ErrorTooltipOptions): JSX.Element {
  const errors = useSelector((state: ApplicationStateModel) =>
    errorSelector(state.actualState.scheduleErrors)
  );
  const errorTriangle = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isToolTipOpen, setToolTipOpen] = useState(false);
  const { styles, attributes } = usePopper(container.current, tooltipRef.current, {
    placement: "right-start",
  });
  const [isFixed, setIsFixed] = useState(false);

  function showErrorTooltip(): void {
    setToolTipOpen(true);
  }

  function hideErrorTooltip(ignoreFixed = false): void {
    if (!isFixed || (ignoreFixed && isFixed)) {
      setToolTipOpen(false);
      setIsFixed(false);
    }
  }

  function handleTriangleClick(event: React.MouseEvent<HTMLHRElement, MouseEvent>): void {
    event.stopPropagation();
    if (!isFixed) {
      setIsFixed(true);
    } else {
      hideErrorTooltip(true);
    }
  }
  return (
    <>
      <Popper
        ref={tooltipRef}
        className="errorTooltip"
        isOpen={isToolTipOpen}
        {...attributes}
        style={{
          ...styles.popper,
        }}
        onMouseLeave={(): void => hideErrorTooltip(false)}
        onClick={handleTriangleClick}
      >
        {errors.map((error, index) => (
          <ErrorListItem
            key={`${error.kind}_${index}`}
            error={ErrorMessageHelper.getErrorMessage(error)}
            interactable={false}
            className="errorTootlip-item"
            showTitle={showErrorTitle}
          />
        ))}
      </Popper>

      <div
        ref={container}
        className={className}
        style={{
          position: "relative",
        }}
        onMouseEnter={showErrorTooltip}
        onMouseLeave={(): void => hideErrorTooltip(false)}
      >
        {errors.length !== 0 && (
          <span ref={errorTriangle} className="error-triangle" onClick={handleTriangleClick} />
        )}
        {children}
      </div>
    </>
  );
}
