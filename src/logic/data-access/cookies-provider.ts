/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export class CookiesProvider {
  public static getCookie(key: string): string | undefined {
    try {
      const filteredCookie = document.cookie
        .split(";")
        .filter((cookie) => cookie.split("=")[0].trim() === key);
      const cookieValue = filteredCookie[0].split("=")[1];
      return cookieValue;
    } catch (err) {
      return;
    }
  }

  public static saveCookie(key: string, value: string): void {
    try {
      document.cookie = `${key}=${value}`;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
}
