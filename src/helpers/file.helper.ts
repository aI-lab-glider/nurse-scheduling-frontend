/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import xlsx from "exceljs";
import JSZip from "jszip";
import _ from "lodash";

export class FileHelper {
  public static saveToFile(workbook: xlsx.Workbook, filename: string): void {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      this.saveFileAs(blob, filename);
    });
  }

  public static async saveMultipleFiles(workbooks: {
    [fileName: string]: xlsx.Workbook;
  }): Promise<void> {
    const zip = new JSZip();
    const splitWorkbooks = this.splitWorkbooksInDirs(workbooks);
    for (const dirName of Object.keys(splitWorkbooks)) {
      const dir = zip.folder(dirName);
      for (const fileName of splitWorkbooks[dirName]) {
        const buffer = await workbooks[fileName].xlsx.writeBuffer();
        const blob = new Blob([buffer]);
        dir?.file(fileName, blob);
      }
    }
    const zipFile = await zip.generateAsync({ type: "blob" });
    this.saveFileAs(zipFile, "baza_danych");
  }

  private static splitWorkbooksInDirs(workbooks): { [dirName: string]: [string] } {
    const monthWorkbooks: { [monthYear: string]: [string] } = {};
    Object.keys(workbooks).forEach((fileName) => {
      const dirName = this.getDirNameFromFile(fileName);
      const files = monthWorkbooks[dirName];
      if (_.isNil(files)) {
        monthWorkbooks[dirName] = [fileName];
      } else {
        monthWorkbooks[dirName].push(fileName);
      }
    });
    return monthWorkbooks;
  }

  public static saveFileAs(blob, filename: string): void {
    const anchor = document.createElement("a");

    anchor.download = filename;
    anchor.href = URL.createObjectURL(blob);

    document.body.appendChild(anchor);

    // eslint-disable-next-line
    // @ts-ignore
    if (window.Cypress) {
      return;
    }

    anchor.click();
  }

  public static getDirNameFromFile(fileName): string {
    const splitedName = fileName.split("_");
    return `${splitedName[0]}_${splitedName[1]}`;
  }
}
