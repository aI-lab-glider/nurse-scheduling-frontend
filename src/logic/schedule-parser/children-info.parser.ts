/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ChildrenInfoProvider } from "../providers/children-info-provider.model";
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";

export class ChildrenInfoParser implements ChildrenInfoProvider {
  private _parseErrors: ScheduleError[] = [];
  private children: number[];

  constructor(data: string[][]) {
    this.children = this.generateChildren(data);
  }

  public get registeredChildrenNumber(): number[] {
    return this.children;
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private generateChildren(raw: string[][]): number[] {
    if (raw.length !== 1) {
      this.logLoadFileError("Sekcja dzieci nie ma oczekiwanych wymiarów");
    }
    const childrenRow = raw[0];
    if (childrenRow.length <= 1) {
      this.logLoadFileError("Sekcja dzieci nie ma oczekiwanych wymiarów");
    }

    childrenRow.shift();

    const children = Array<number>();

    childrenRow.forEach((a, id) => {
      const numDay = parseInt(a);
      if (typeof numDay !== "number" || numDay < 0) {
        this.logLoadFileError("Błąd w sekcji dzieci w kolumnie numer " + (id + 1));
      }
      children.push(numDay);
    });

    return children;
  }
}
