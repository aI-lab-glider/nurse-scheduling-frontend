/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { EmptyMonthButtons } from "./empty-month-buttons";

export function NewScheduleComponent(): JSX.Element {
  return (
    <div className={"newMonthComponents"}>
      <img
        src="https://filestore.community.support.microsoft.com/api/images/72e3f188-79a1-465f-90ca-27262d769841"
        alt=""
      />
      <pre>Nie masz planu na ten miesiąc</pre>
      <EmptyMonthButtons />
    </div>
  );
}
