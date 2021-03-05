/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";

export type Opaque<K, T> = T & { __TYPE__: K };

export function isAgrumentsDefined<T extends {}>(args: T): args is Required<T> {
  const isAnyAgrumentUndefined = _.some(Object.values(args), (argument) => _.isNil(argument));
  return !isAnyAgrumentUndefined;
}
