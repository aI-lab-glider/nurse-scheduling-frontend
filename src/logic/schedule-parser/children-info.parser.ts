/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ChildrenInfoProvider } from "../providers/children-info-provider.model";
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";
import { MetaDataParser } from "./metadata.parser";

export class ChildrenInfoParser implements ChildrenInfoProvider {
  private _parseErrors: ScheduleError[] = [];
  private children: number[];

  constructor(private metaData: MetaDataParser, data?: string[][]) {
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

  private generateChildren(raw?: string[][]): number[] {
    if (!raw || raw.length !== 1) {
      this.logLoadFileError(
        "Brak informacji o liczbie dzieci. Przyjęto, że w każdym dniu liczba dzieci wynosi 0"
      );

      const N = this.metaData.dayCount;
      const children = Array(N);
      let i = 0;

      while (i < N) children[i++] = 0;
      return children;
    }
    const childrenRow = raw[0];

    const slicedChildrenRow = childrenRow.slice(
      this.metaData.offset,
      this.metaData.offset + this.metaData.dayCount
    );

    if (slicedChildrenRow.length !== this.metaData.dayCount) {
      this.logLoadFileError(
        "Sekcja dzieci nie ma oczekiwanych wymiarów. Przyjęto, że w brakujących dniach liczba dzieci wynosi 0"
      );
    }

    const children = Array<number>();

    for (let i = 0; i < this.metaData.dayCount; i++) {
      const numDay = parseInt(slicedChildrenRow[i]);
      if (isNaN(numDay) || numDay < 0) {
        this.logLoadFileError(
          "Nieoczekiwana wartość w sekcji dzieci w dniu " +
            (i + 1) +
            ". Przyjęto, że liczba dzieci wynosi 0"
        );
        children.push(0);
      } else {
        children.push(numDay);
      }
    }

    return children;
  }
}
