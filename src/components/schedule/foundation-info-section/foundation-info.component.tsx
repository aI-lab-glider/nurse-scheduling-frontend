/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as S from "./foundation-info.styled";
import { DataRowHelper } from "../../../helpers/data-row.helper";
import { DataRow } from "../../../logic/schedule-logic/data-row";
import { ChildrenSectionKey, ExtraWorkersSectionKey } from "../../../logic/section.model";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { FoundationInfoActionCreator } from "../../../state/schedule-data/foundation-info/foundation-info.action-creator";
import { NameTableComponent } from "../worker-info-section/name-table/nametable.component";
import { ScheduleMode } from "../schedule-state.model";
import { BaseSectionComponent } from "../base/base-section/base-section.component";
import { SelectionMatrix } from "../base/base-section/use-selection-matrix";
import { useFoundationInfo } from "../../../hooks/use-foundation-info";

export function FoundationInfoComponent(): JSX.Element {
  const { childrenNumber, extraWorkers } = useFoundationInfo();

  const { mode } = useSelector((state: ApplicationStateModel) => state.actualState);

  const isEditable = mode === ScheduleMode.Edit;

  const sectionData = [
    new DataRow(ChildrenSectionKey.RegisteredChildrenCount, childrenNumber, isEditable),
    new DataRow(ExtraWorkersSectionKey.ExtraWorkersCount, extraWorkers, isEditable),
  ];

  const dispatch = useDispatch();
  const updateFoundationInfoData = useCallback(
    (selectionMatrix: SelectionMatrix, oldData: DataRow<string>[], newValue: string) => {
      // TODO: Fix unkonw
      const updatedDataRows = DataRowHelper.copyWithReplaced<number>(
        selectionMatrix,
        (oldData as unknown) as DataRow<number>[],
        parseInt(newValue, 10)
      );
      const updatedFoundationInfo = DataRowHelper.dataRowsAsValueDict<number>(updatedDataRows);
      const action = FoundationInfoActionCreator.updateFoundationInfo(
        updatedFoundationInfo[ChildrenSectionKey.RegisteredChildrenCount],
        updatedFoundationInfo[ExtraWorkersSectionKey.ExtraWorkersCount]
      );
      dispatch(action);
    },
    [dispatch]
  );
  return (
    <div style={{ display: "inline-block" }}>
      <S.SectionContainer className="borderContainer">
        <div>
          <NameTableComponent data={sectionData} isWorker={false} />
        </div>
        <div>
          <div>
            <S.FoundationSectionWrapper data-cy="foundationInfoSection">
              <BaseSectionComponent
                sectionKey="foundationInfo"
                data={sectionData}
                updateData={updateFoundationInfoData}
              />
            </S.FoundationSectionWrapper>
          </div>
        </div>
      </S.SectionContainer>
    </div>
  );
}
