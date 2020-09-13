export class StringHelper {
  static areEquvivalent(string1: string | null, string2: string | null) {
    return (
      string1 && string2 && StringHelper.getRawValue(string1) === StringHelper.getRawValue(string2)
    );
  }

  static includesEquvivalent(value: string, substring: string) {
    return StringHelper.getRawValue(value).includes(StringHelper.getRawValue(substring));
  }

  static getRawValue(value: string | null | undefined): string {
    return value?.toLowerCase().trim() || "";
  }

  static generateUuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
