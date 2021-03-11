/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { ScheduleErrorMessageModel } from "../../../../common-models/schedule-error-message.model";
import ModalErrorListItem from "./error.modal.list.item.component";

interface Options {
  errors?: ScheduleErrorMessageModel[];
}

export default function ModalErrorList({ errors = [] }: Options): JSX.Element {
  return (
    <>
      {errors?.length > 0 &&
        errors.map(
          (error, index): JSX.Element => (
            <ModalErrorListItem key={`${error.kind}_${index}`} error={error} />
          )
        )}
      {errors?.length === 0 && "Nie znaleziono błędów"}{" "}
    </>
  );
}
