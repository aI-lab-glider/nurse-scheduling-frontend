import React from "react";
import CaretakerIcon from "../../../../assets/images/svg-components/CaretakerIcon";
import NurseIcon from "../../../../assets/images/svg-components/NurseIcon";
import { t } from "../../../../helpers/translations.helper";
import { WorkerType } from "../../../../state/schedule-data/worker-info/worker-info.model";
import * as S from "./WorkerTypeLabel.styled";

interface WorkerTypeLabelInterface {
  workerType: WorkerType;
}

export const WorkerTypeLabel = ({ workerType }: WorkerTypeLabelInterface) => (
  <S.WorkerTypeLabelContainer className={`${workerType.toString().toLowerCase()}-label`}>
    {workerType === WorkerType.NURSE ? (
      <NurseIcon width={14} height={16} />
    ) : (
      <CaretakerIcon width={18} height={15} />
    )}
    {t(workerType)}
  </S.WorkerTypeLabelContainer>
);
