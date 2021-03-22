/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { Link } from "react-router-dom";

export interface ConditionalLinkOptions {
  children: JSX.Element[];
  to: string;
  shouldNavigate: boolean;
}

export default function ConditionalLink(options: ConditionalLinkOptions): JSX.Element {
  const { children, to, shouldNavigate: condition } = options;

  return (
    <>
      {condition && <Link to={to}>{children}</Link>}
      {!condition && children}
    </>
  );
}
