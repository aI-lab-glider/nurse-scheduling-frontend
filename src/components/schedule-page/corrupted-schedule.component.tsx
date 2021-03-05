/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { EmptyMonthButtons } from "./empty-month-buttons";

const MESSAGE =
  "Nie można wyświetlić zapisanego grafiku.\n Spróbuj go ponownie wgrać lub, jeśli to możliwe, skopiować z poprzedniego miesiąca.";

export function CorruptedScheduleComponent(): JSX.Element {
  return (
    <div className={"newMonthComponents"}>
      <img src={require("../../assets/images/sadEmoji.svg")} alt="" />
      <pre>{MESSAGE}</pre>
      <EmptyMonthButtons />
    </div>
  );
}
