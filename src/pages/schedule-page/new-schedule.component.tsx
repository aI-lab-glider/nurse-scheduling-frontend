/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { EmptyMonthButtons } from "./empty-month-buttons";
import nurse from "../../assets/images/nurse.png";

export function NewScheduleComponent(): JSX.Element {
  return (
    <div className={"newMonthComponents"}>
      <img src={nurse} alt="" />
      <pre>Nie masz planu na ten miesiąc</pre>
      <EmptyMonthButtons />
    </div>
  );
}
