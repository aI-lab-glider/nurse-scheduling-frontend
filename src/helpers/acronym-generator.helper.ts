import { shifts } from "../common-models/shift-info.model";

export class AcronymGenerator {
  static generate(word: string): string {
    const re = /\s*(?:[;:\-+\s]|$)\s*/;
    const shiftAcrs = Object.values(shifts).map((shift) => shift.code);
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
