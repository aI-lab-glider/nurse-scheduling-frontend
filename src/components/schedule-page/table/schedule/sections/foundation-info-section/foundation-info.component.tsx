/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { DataRowHelper } from "../../../../../../helpers/data-row.helper";
import { DataRow } from "../../../../../../logic/schedule-logic/data-row";
import { FoundationSectionKey } from "../../../../../../logic/section.model";
import { FoundationInfoActionCreator } from "../../../../../../state/reducers/month-state/schedule-data/foundation-info.action-creator";
import { NameTableComponent } from "../../../../../namestable/nametable.component";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
import { SelectionMatrix } from "../base-section/use-selection-matrix";
import { useFoundationInfo } from "./use-foundation-info";
export type FoundationInfoOptions = Omit<BaseSectionOptions, "sectionKey" | "updateData">;

export function FoundationInfoComponent(options: FoundationInfoOptions): JSX.Element {
  const { childrenNumber, extraWorkers } = useFoundationInfo();

  const sectionData = [
    new DataRow(FoundationSectionKey.ChildrenCount, childrenNumber),
    new DataRow(FoundationSectionKey.ExtraWorkersCount, extraWorkers),
  ];

  const dispatch = useDispatch();
  const updateFoundationInfoData = useCallback(
    (selectionMatrix: SelectionMatrix, oldData: DataRow<string>[], newValue: string) => {
      // TODO: Fix unkonw
      const updatedDataRows = DataRowHelper.copyWithReplaced<number>(
        selectionMatrix,
        (oldData as unknown) as DataRow<number>[],
        parseInt(newValue)
      );
      const updatedFoundationInfo = DataRowHelper.dataRowsAsValueDict<number>(updatedDataRows);
      const action = FoundationInfoActionCreator.updateFoundationInfo(
        updatedFoundationInfo[FoundationSectionKey.ChildrenCount],
        updatedFoundationInfo[FoundationSectionKey.ExtraWorkersCount]
      );
      dispatch(action);
    },
    [dispatch]
  );
  return (
    <tr className="sectionContainer">
      <td>
        <NameTableComponent data={sectionData} clickable={false} />
      </td>
      <td>
        <table>
          <tbody className="table" data-cy="foundationInfoSection">
            <BaseSectionComponent
              sectionKey="foundationInfo"
              data={sectionData}
              updateData={updateFoundationInfoData}
            />
          </tbody>
        </table>
      </td>
      <td />
    </tr>
  );
}
