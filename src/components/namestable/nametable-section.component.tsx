import React from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";

export interface NameTableCellOptions {
  dataRow: DataRow[];
}

export function NameTableSection({ dataRow }: NameTableCellOptions): JSX.Element {
  function getNames(): string[] {
    return dataRow.map((a) => a.rowKey);
  }

  const data = getNames();

  return (
    <React.Fragment>
      <table className="nametable">
        <tbody>
          {data.map((cellData) => {
            return (
              <tr key={cellData} className="nametableRow">
                <td>
                  <span>{cellData}</span>
                  <span className="underline"></span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
}
