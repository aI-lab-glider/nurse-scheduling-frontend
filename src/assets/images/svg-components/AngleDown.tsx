/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as React from "react";

function AngleDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={19} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.266 12.695 4.93 8.39c-.176-.176-.176-.342 0-.498l.556-.586c.176-.157.342-.157.498 0L9.5 10.79l3.516-3.486c.156-.157.322-.157.498 0l.556.586c.176.156.176.322 0 .498l-4.336 4.306c-.156.157-.312.157-.468 0Z"
        fill="#333"
      />
    </svg>
  );
}

export default AngleDown;
