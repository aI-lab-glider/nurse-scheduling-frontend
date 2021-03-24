/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { ScheduleErrorMessageModel } from "../../../../common-models/schedule-error-message.model";

interface Options {
  error: ScheduleErrorMessageModel;
}

export default function ModalErrorListItem({ error }: Options): JSX.Element {
  const displayTitle = error.title && error.title !== "Nie rozpoznano błędu";
  return (
    <div className="error-list-item">
      <div className="red-rectangle" />
      <div className="error-modal">
        {displayTitle && (
          <div className="error-title">
            <p className="error-title-content">{error.title}</p>
          </div>
        )}
        <div
          className="error-text-modal"
          dangerouslySetInnerHTML={{ __html: error.message || "" }}
        />
      </div>
    </div>
  );
}
