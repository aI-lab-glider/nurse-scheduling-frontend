/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import { WorkerInfoModel, WorkerTypeHelper } from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";
import { useWorkerHoursInfo } from "../schedule-page/table/schedule/use-worker-hours-info";
import WorkersCalendar from "../workers-page/workers-calendar/workers-calendar.component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../common-components";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  const workerHoursInfo = useWorkerHoursInfo(info.name);

  const exportPdf = (): void => {
    const query = document.querySelectorAll("#worker-info-export, #calendar-export");
    const pdf = new jsPDF("portrait", "mm", "a4");
    const queryLen = query.length;
    const margin = 10;
    const calendarH = 150;
    const calendarW = 190;
    let heightToPlaceElement = 10;
    if (query) {
      query.forEach((element, index) => {
        html2canvas(element as HTMLElement, {
          scale: 2,
          onclone: function (document) {
            const selectorsEveryDay: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
              "div.BottomCellPart"
            );
            selectorsEveryDay.forEach((selector) => {
              const color = selector.style.backgroundColor;
              selector.style.backgroundColor = "white";
              selector.style.border = "2px solid " + color;
              selector.style.borderRadius = "4px 0 0 4px";
              selector.style.borderLeft = "";
            });

            const selectorsKeepOn: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
              "div.keepOntrue"
            );
            selectorsKeepOn.forEach((selector) => {
              selector.style.borderLeft = "";
              selector.style.borderRadius = "0";
            });

            const selectorsHasNext: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
              "div.hasNexttrue"
            );
            selectorsHasNext.forEach((selector) => {
              selector.style.borderRight = "";
              selector.style.borderRadius = "4px 0 0 4px";
            });

            const selectorsKeepOnHasNext: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
              "div.hasNexttrue.keepOntrue"
            );
            selectorsKeepOnHasNext.forEach((selector) => {
              selector.style.borderLeft = "";
              selector.style.borderRight = "";
              selector.style.borderRadius = "";
            });

            const selectorsLeftBorders: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
              "div.leftBorderExport"
            );
            selectorsLeftBorders.forEach((selector) => {
              selector.style.width = "2px";
            });
          },
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png", 1.0);
          if (element.id === "worker-info-export") {
            pdf.addImage(imgData, "PNG", margin, heightToPlaceElement, 0, 0);
          } else if (element.id === "calendar-export") {
            pdf.addImage(imgData, "PNG", margin, heightToPlaceElement, calendarW, calendarH);
          }
          if (index === queryLen - 1) {
            pdf.save(info.name + ".pdf");
          } else {
            heightToPlaceElement += canvas.height / 4 + margin;
          }
        });
      });
    }
  };

  return (
    <>
      <div
        className={"span-primary workers-table"}
        style={{
          height: "650px",
        }}
      >
        <div id={"worker-info-export"}>
          <div className={"workers-table"}>
            <p>{StringHelper.capitalizeEach(info.name)}</p>

            {info.type && (
              <span
                className={classNames(
                  "worker-label",
                  `${info.type?.toString().toLowerCase()}-label`
                )}
              >
                {StringHelper.capitalize(WorkerTypeHelper.translate(info.type))}
              </span>
            )}
          </div>
          <br />
          <div className="worker-info">
            <p>Typ umowy:</p>
            <p>Ilość godzin: {workerHoursInfo.workerHourNorm}</p>
            <p>Ilość nadgodzin: {workerHoursInfo.overTime}</p>
            <p>Suma godzin: {info.time}</p>
            <div data-html2canvas-ignore="true">
              <Divider />
            </div>
            <div id={"zmiany"}>
              <b>ZMIANY</b>
            </div>
          </div>
        </div>
        <div
          id={"calendar-export"}
          style={{
            height: "500px",
          }}
        >
          <WorkersCalendar shiftsArr={info.shifts!} />
        </div>
      </div>
      <Button variant={"primary"} onClick={exportPdf}>
        Pobierz
      </Button>
    </>
  );
}
