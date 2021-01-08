/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";

export function EmptyRowComponent({ rowHeight = 20 }): JSX.Element {
  return <tr style={{ height: `${rowHeight}px` }}></tr>;
}
