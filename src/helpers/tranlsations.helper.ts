export class TranslationHelper {
  public static get polishMonths(): string[] {
    return Object.keys(TranslationHelper.monthTranslations);
  }
  public static get englishMonths(): string[] {
    return Object.values(TranslationHelper.monthTranslations);
  }

  // suggestions appreciated since this is kinda whack
  public static get workHoursInfoHeader(): { [key: string]: string } {
    return {
      requiredHours: "Godziny wymagane",
      actualHours: "Godziny wypracowane",
      overtime: "Nadgodziny",
    };
  }

  private static get monthTranslations(): { [key: string]: string } {
    return {
      styczeń: "january",
      luty: "february",
      marzec: "march",
      kwiecień: "april",
      maj: "may",
      czerwiec: "june",
      lipiec: "july",
      sierpień: "august",
      wrzesień: "september",
      październik: "october",
      listopad: "november",
      grudzień: "december",
    };
  }
}
