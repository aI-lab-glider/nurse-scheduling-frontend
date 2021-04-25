/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ArrayHelper } from "../../../../src/helpers/array.helper";

describe("ArrayHelper", () => {
  describe("zip", () => {
    context("when first array is shorter than second", () => {
      const first = [1, 2];
      const second = [1, 2, 3];

      it("zips and fills with undefined", () => {
        expect(ArrayHelper.zip(first, second)).to.eql([
          [1, 1],
          [2, 2],
          [undefined, 3],
        ]);
      });
    });

    context("when first array is longer than second", () => {
      const first = [1, 2, 3];
      const second = [1, 2];

      it("zips and fills with undefined", () => {
        expect(ArrayHelper.zip(first, second)).to.eql([
          [1, 1],
          [2, 2],
          [3, undefined],
        ]);
      });
    });

    context("when arrays are of equal length", () => {
      const first = [1, 2];
      const second = [1, 2];

      it("zips", () => {
        expect(ArrayHelper.zip(first, second)).to.eql([
          [1, 1],
          [2, 2],
        ]);
      });
    });
  });
});
