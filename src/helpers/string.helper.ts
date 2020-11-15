export class StringHelper {
  static areEquivalent(string1: string | null, string2: string | null): boolean | "" | null {
    return (
      string1 && string2 && StringHelper.getRawValue(string1) === StringHelper.getRawValue(string2)
    );
  }

  static includesEquivalent(value: string, substring: string): boolean {
    return StringHelper.getRawValue(value).includes(StringHelper.getRawValue(substring));
  }

  static getRawValue(value: string | null | undefined): string {
    return value?.toLowerCase().trim() || "";
  }

  static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
