/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useTranslation } from "react-i18next";
import { ScheduleErrorMessageModel } from "../../state/schedule-data/schedule-errors/schedule-error-message.model";

interface SpanErrorOptions {
  errors?: ScheduleErrorMessageModel[];
}

export function SpanErrors({ errors = [] }: SpanErrorOptions): JSX.Element {
  const { t } = useTranslation();

  //TODO Get rid of this file
  return (
    <>
      <div className={"span-errors"}>
        <div className={"error-span-main-block"}>
          <div className={"error-numbers"}>
            <p>
              {t("errors")} : {errors?.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
