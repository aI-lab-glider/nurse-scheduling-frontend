/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import classNames from "classnames/bind";
import React, { ReactNode, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../common-models/schedule-error.model";
import { ApplicationStateModel } from "../../../../../state/models/application-state.model";

export interface ErrorTooltipOptions {
  children: ReactNode;
  errorSelector: (scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
  className?: string;
  showErrorTitle?: boolean;
  id?: string;
  tooltipClassname?: string;
}

export function ErrorTooltipProviderF({
  showErrorTitle,
  children,
  errorSelector,
  className,
  id,
  tooltipClassname,
}: ErrorTooltipOptions): JSX.Element {
  const errors = useSelector((state: ApplicationStateModel) =>
    errorSelector(state.actualState.scheduleErrors)
  );
  const errorTriangle = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null); // TODO TASK-182

  // TODO TASK-182
  // const tooltipRef = useRef<HTMLDivElement>(null);
  // const [isToolTipOpen, setToolTipOpen] = useState(false);
  // const { styles, attributes } = usePopper(container.current, tooltipRef.current, {
  //   placement: "right-start",
  // });

  const [isFixed, setIsFixed] = useState(false);

  // TODO TASK-182
  // function showErrorTooltip(): void {
  //   setToolTipOpen(true);
  // }

  // function hideErrorTooltip(ignoreFixed = false): void {
  //   if (!isFixed || (ignoreFixed && isFixed)) {
  //     setToolTipOpen(false);
  //     setIsFixed(false);
  //   }
  // }

  function handleTriangleClick(event: React.MouseEvent<HTMLHRElement, MouseEvent>): void {
    event.stopPropagation();
    if (!isFixed) {
      setIsFixed(true);
    } else {
      // hideErrorTooltip(true);
    }
  }

  return (
    <>
      {/* // TODO TASK-182 

      <Popper
        ref={tooltipRef}
        className="errorTooltip"
        isOpen={isToolTipOpen}
        {...attributes.popper}
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
      </Popper> */}

      <div
        id={id}
        ref={container}
        className={className}
        style={{
          position: "relative",
        }}
        // onMouseEnter={showErrorTooltip}
        // onMouseLeave={(): void => hideErrorTooltip(false)}
      >
        {errors.length !== 0 && (
          <span
            ref={errorTriangle}
            className={classNames("error-triangle", tooltipClassname)}
            onClick={handleTriangleClick}
          />
        )}
        {children}
      </div>
    </>
  );
}

export const ErrorTooltipProvider = React.memo(ErrorTooltipProviderF, () => {
  const areTooltipsSame = true;
  return areTooltipsSame;
});
