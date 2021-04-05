/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftsTypesDict } from "../state/schedule-data/shifts-types/shift-types.model";

export class AcronymGenerator {
  static generate(word: string, shiftsTypes: ShiftsTypesDict): string {
    const re = /\s*(?:[;:\-+\s]|$)\s*/;
    const shiftAcrs = Object.values(shiftsTypes).map((shift) => shift.code);
    shiftAcrs.push("");
    let acronym = "";
    const wordSpliting = word.split(re);
    acronym = wordSpliting.reduce((acr, l) => (acr += l.charAt(0).toUpperCase()), "");
    if (!shiftAcrs.includes(acronym)) {
      return acronym;
    } else {
      const acronym = wordSpliting.map((word) => word.charAt(0).toUpperCase());
      let acronymString = acronym.join("");
      let wordNumber = 0;
      while (shiftAcrs.includes(acronymString) && wordNumber < wordSpliting.length) {
        let letterNumber = 1;
        while (
          shiftAcrs.includes(acronymString) &&
          letterNumber < wordSpliting[wordNumber].length
        ) {
          acronym[wordNumber] += wordSpliting[wordNumber].charAt(letterNumber).toUpperCase();
          acronymString = acronym.join("");
          letterNumber += 1;
        }
        wordNumber += 1;
      }
      return acronymString;
    }
  }
}
