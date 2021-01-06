/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { StringHelper } from "../../../../src/helpers/string.helper";

describe("StringHelper", () => {
  describe("areEquivalent", () => {
    it("should return true when equivalent", () => {
      expect(StringHelper.areEquivalent("str", "str")).to.equal(true);
      expect(StringHelper.areEquivalent("   str", "STR   ")).to.equal(true);
    });
    it("should return false when not equivalent", () => {
      expect(StringHelper.areEquivalent("int", "str")).to.equal(false);
      expect(StringHelper.areEquivalent("straight", "string")).to.equal(false);
    });
    it("should return false when comparing null values with strings", () => {
      expect(StringHelper.areEquivalent(null, "str")).to.equal(false);
      expect(StringHelper.areEquivalent(null, null)).to.equal(false);
    });
    it("should return empty string when comparing empty strings", () => {
      expect(StringHelper.areEquivalent("", "")).to.equal(false);
      expect(StringHelper.areEquivalent("alice", "")).to.equal(false);
      expect(StringHelper.areEquivalent("", "alice")).to.equal(false);
    });
  });

  describe("includesEquivalent", () => {
    it("should return true when includes equivalent", () => {
      expect(StringHelper.includesEquivalent("  AliCE  ", "  lice ")).to.equal(true);
    });
    it("should return false when does not include equivalent", () => {
      expect(StringHelper.includesEquivalent("  AliC E  ", "lice")).to.equal(false);
    });
  });

  describe("getRawValue", () => {
    it("should return raw value", () => {
      expect(StringHelper.getRawValue("  AliCE  ")).to.equal("alice");
      expect(StringHelper.getRawValue(null)).to.equal("");
      expect(StringHelper.getRawValue(undefined)).to.equal("");
    });
  });

  describe("capitalize", () => {
    it("should capitalize", () => {
      expect(StringHelper.capitalize("alice")).to.equal("Alice");
      expect(StringHelper.capitalize("")).to.equal("");
      expect(StringHelper.capitalize("123")).to.equal("123");
    });
  });
});
