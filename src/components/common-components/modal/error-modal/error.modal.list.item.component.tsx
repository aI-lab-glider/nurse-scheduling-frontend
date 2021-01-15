/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { ScheduleErrorMessageModel } from "../../../../common-models/schedule-error-message.model";

interface Options {
  error: ScheduleErrorMessageModel;
}

export default function ModalErrorListItem({ error }: Options): JSX.Element {
  return (
    <div className="error-list-item">
      <div className="red-rectangle" />
      <div className="error-text">{error.message}</div>
    </div>
  );
}
