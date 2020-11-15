/// <reference types="cypress" />

import {StringHelper} from "../../../../src/helpers/string.helper";

describe("StringHelper", () => {
  describe("areEquivalent", () => {
    it("should return true when equivalent", () => {
      expect(StringHelper.areEquivalent("str", "str")).to.equal(true);
      expect(StringHelper.areEquivalent("   str", "str   ")).to.equal(true);

    });
    it( "should return null when comparing null values with strings", () => {
      expect(StringHelper.areEquivalent(null, "str")).to.equal(null);
      expect(StringHelper.areEquivalent(null, null)).to.equal(null);
    });
    it( "should return empty string when comparing empty strings", () => {
      expect(StringHelper.areEquivalent("", "")).to.equal("");
      expect(StringHelper.areEquivalent("alice", "")).to.equal("");
      expect(StringHelper.areEquivalent("", "alice")).to.equal("");
    });
  });

  describe( "includesEquivalent", () => {
    it( "should return true when includes equivalent", () => {
      expect(StringHelper.includesEquivalent("  AliCE  ", "  lice ")).to.equal(true);
    });
    it( "should return false when does not include equivalent", () => {
      expect(StringHelper.includesEquivalent("  AliC E  ", "lice")).to.equal(false);
    });
  });

  describe( "getRawValue", () => {
    it( "should return raw value", () => {
      expect(StringHelper.getRawValue("  AliCE  ")).to.equal("alice");
      expect(StringHelper.getRawValue(null)).to.equal("");
      expect(StringHelper.getRawValue(undefined)).to.equal("");
    });
  });

  describe( "capitalize", () => {
    it( "should capitalize", () => {
      expect(StringHelper.capitalize("alice")).to.equal("Alice");
      expect(StringHelper.capitalize("")).to.equal("");
      expect(StringHelper.capitalize("123")).to.equal("123");
    });
  });
});