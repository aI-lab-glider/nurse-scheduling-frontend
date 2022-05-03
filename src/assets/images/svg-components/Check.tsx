/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as React from "react";

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={19} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14.773 4.432c.157-.157.323-.157.498 0l.82.85c.177.155.177.322 0 .497l-8.788 8.79c-.157.156-.323.156-.498 0l-3.897-3.926c-.176-.157-.176-.323 0-.498l.82-.82c.176-.177.342-.177.499 0l2.841 2.841 7.705-7.734Z"
        fill="#333"
      />
    </svg>
  );
}

export default Check;
