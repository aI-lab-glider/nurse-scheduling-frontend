/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { StringHelper } from "../../../../src/helpers/string.helper";

describe("StringHelper", () => {
  describe("areEquivalent", () => {
    context("when two strings are equal", () => {
      it("returns true", () => {
        expect(StringHelper.areEquivalent("str", "str")).to.equal(true);
      });
    });

    context("when two strings differ with case and leading/trailing whitespaces", () => {
      it("returns true", () => {
        expect(StringHelper.areEquivalent("   str", "STR   ")).to.equal(true);
      });
    });

    context("when two strings are different", () => {
      it("returns false", () => {
        expect(StringHelper.areEquivalent("int", "str")).to.equal(false);
      });
    });

    context("when one of the values is null", () => {
      it("returns false", () => {
        expect(StringHelper.areEquivalent(null, "str")).to.equal(false);
        expect(StringHelper.areEquivalent("str", null)).to.equal(false);
      });
    });

    context("when both values are null", () => {
      it("returns false", () => {
        expect(StringHelper.areEquivalent(null, null)).to.equal(false);
      });
    });

    context("when one of the values is empty string", () => {
      it("compares values properly", () => {
        expect(StringHelper.areEquivalent("", "str")).to.equal(false);
        expect(StringHelper.areEquivalent("str", "")).to.equal(false);
        expect(StringHelper.areEquivalent("", "")).to.equal(false);
      });
    });
  });

  describe("includesEquivalent", () => {
    context("when string contains value", () => {
      it("recognizes it correctly", () => {
        expect(StringHelper.includesEquivalent("  AliCE  ", "  lice ")).to.equal(true);
      });
    });

    context("when string does not contain value", () => {
      it("recognizes it correctly", () => {
        expect(StringHelper.includesEquivalent("  AliC E  ", "  lice ")).to.equal(false);
      });
    });
  });

  describe("getRawValue", () => {
    context("when letters are present in both upper and lower cases", () => {
      it("tuns input into lowercase", () => {
        expect(StringHelper.getRawValue("AliCE")).to.equal("alice");
      });
    });

    context("when input value has leading and trailing whitespaces", () => {
      it("strips input", () => {
        expect(StringHelper.getRawValue("  alice   ")).to.equal("alice");
      });
    });

    context("when input value is null", () => {
      it("returns empty string", () => {
        expect(StringHelper.getRawValue(null)).to.equal("");
      });
    });

    context("when input value is undefined", () => {
      it("returns empty string", () => {
        expect(StringHelper.getRawValue(undefined)).to.equal("");
      });
    });
  });

  describe("capitalize", () => {
    context("when input is empty string", () => {
      it("return empty string", () => {
        expect(StringHelper.capitalize("")).to.equal("");
      });
    });

    context("when input's first letter is lower case ", () => {
      it("capitalizes first letter", () => {
        expect(StringHelper.capitalize("str")).to.equal("Str");
      });
    });

    context("when input is numerical", () => {
      it("does not alter the input", () => {
        expect(StringHelper.capitalize("123")).to.equal("123");
      });
    });
  });

  describe("capitalizeEach", () => {
    context("when passing single argumetn", () => {
      context("when input is empty string", () => {
        it("return empty string", () => {
          expect(StringHelper.capitalizeEach("")).to.equal("");
        });
      });

      context("when input's first letter is lower case ", () => {
        it("capitalizes whole string", () => {
          expect(StringHelper.capitalizeEach("str1 str2")).to.equal("Str1 Str2");
        });
      });

      context("when input is numerical", () => {
        it("does not alter the input", () => {
          expect(StringHelper.capitalizeEach("123")).to.equal("123");
        });
      });
    });

    context("when passing single argumetn", () => {
      const separtor = ",";

      context("when input is empty string", () => {
        it("return empty string", () => {
          expect(StringHelper.capitalizeEach("", separtor)).to.equal("");
        });
      });

      context("when input's first letter is lower case ", () => {
        it("capitalizes whole string", () => {
          expect(StringHelper.capitalizeEach("str1,str2 str3", separtor)).to.equal(
            "Str1,Str2 str3"
          );
        });
      });

      context("when input is numerical", () => {
        it("does not alter the input", () => {
          expect(StringHelper.capitalizeEach("123,123", separtor)).to.equal("123,123");
        });
      });
    });
  });
});
