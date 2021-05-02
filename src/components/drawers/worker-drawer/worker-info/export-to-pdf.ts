/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  bottomCellPartClassName,
  hasNextShiftClassName,
  keepOnShiftClassName,
  leftBorderClassName,
} from "../../../schedule/base/base-cell/base-cell.models";

interface ExportToPdfOptions {
  workerInfoExport: string;
  calendarExport: string;
}

export const exportToPdf = (name: string, props: ExportToPdfOptions): void => {
  const query = document.querySelectorAll(`#${props.workerInfoExport}, #${props.calendarExport}`);
  const pdf = new JsPDF("portrait", "mm", "a4");
  const queryLen = query.length;
  const margin = 10;
  const calendarH = 150;
  const calendarW = 190;
  let heightToPlaceElement = 10;

  query.forEach((element, index) => {
    html2canvas(element as HTMLElement, {
      scale: 2,
      onclone(document: Document) {
        const selectorsEveryDay: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
          `div.${bottomCellPartClassName()}`
        );
        selectorsEveryDay.forEach((selector) => {
          const color = selector.style.backgroundColor;
          selector.style.backgroundColor = "white";
          selector.style.border = `3px solid ${color}`;
          selector.style.borderRadius = "4px";
        });

        const selectorsKeepOn: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
          `div.${keepOnShiftClassName(true)}`
        );
        selectorsKeepOn.forEach((selector) => {
          selector.style.borderLeft = "";
          selector.style.borderRadius = "0 0 4px 0";
        });

        const selectorsHasNext: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
          `div.${hasNextShiftClassName(true)}`
        );
        selectorsHasNext.forEach((selector) => {
          selector.style.borderRight = "";
          selector.style.borderRadius = "4px 0 0 4px";
        });

        const selectorsKeepOnHasNext: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
          `div.${keepOnShiftClassName(true)}.${hasNextShiftClassName(true)}`
        );
        selectorsKeepOnHasNext.forEach((selector) => {
          selector.style.borderRight = "";
          selector.style.borderRadius = "";
        });

        const selectorsLeftBorder: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
          `div.${leftBorderClassName()}`
        );
        selectorsLeftBorder.forEach((selector) => {
          selector.style.width = "0";
          selector.style.height = "0";
        });
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      if (element.id === props.workerInfoExport) {
        pdf.addImage(imgData, "PNG", margin, heightToPlaceElement, 0, 0);
      } else if (element.id === props.calendarExport) {
        pdf.addImage(imgData, "PNG", margin, heightToPlaceElement, calendarW, calendarH);
      }
      if (index === queryLen - 1) {
        pdf.save(`${name}.pdf`);
      } else {
        heightToPlaceElement += canvas.height / 4 + margin;
      }
    });
  });
};
