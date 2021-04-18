/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import en from "./en";
import pl from "./pl";
const translations = { en, pl };
export type pl = keyof typeof pl["translation"];
export type en = keyof typeof en["translation"];
export type Localization = pl | en;
export default translations;
