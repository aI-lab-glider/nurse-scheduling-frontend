/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import { WorkerInfoModel, WorkerTypeHelper } from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";
import { WorkersCalendar } from "../workers-page/workers-calendar/workers-calendar.component";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Button } from "../common-components";

export class WorkerInfoComponent extends React.Component<WorkerInfoModel> {
  private pdfExportComponent: any;
  exportPDF = (): void => {
    this.pdfExportComponent.save();
  };

  render(): JSX.Element {
    const info = this.props;
    return (
      <>
        <PDFExport
          paperSize={"Letter"}
          fileName="_____.pdf"
          title=""
          subject=""
          keywords=""
          margin="1cm"
          ref={(component): PDFExport | null => (this.pdfExportComponent = component)}
        >
          <div
            style={{
              height: "650px",
            }}
          >
            <div className={"span-primary workers-table"}>
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
                <p>Ilość godzin: {info.requiredHours}</p>
                <p>Ilość nadgodzin: {info.overtime}</p>
                <p>Suma godzin: {info.time}</p>
                <Divider />
                <div id={"zmiany"}>
                  <b>ZMIANY</b>
                </div>
              </div>
              <WorkersCalendar shiftsArr={info.shifts!} />
            </div>
          </div>
        </PDFExport>
        <Button variant={"primary"} onClick={this.exportPDF}>
          Pobierz
        </Button>
      </>
    );
  }
}
