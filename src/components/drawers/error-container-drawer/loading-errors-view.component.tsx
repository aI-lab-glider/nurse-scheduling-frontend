/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import backend from "../../../api/backend";
import ok from "../../../assets/images/ok.svg";
import warning from "../../../assets/images/warning.svg";
import { ScheduleErrorMessageModel } from "../../../state/schedule-data/schedule-errors/schedule-error-message.model";
import {
  NetworkErrorCode,
  ScheduleError,
} from "../../../state/schedule-data/schedule-errors/schedule-error.model";
import { ActionModel } from "../../../utils/action.model";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { Button } from "../../common-components";
import ErrorList from "../../error-list/error-list.component";
import { ErrorLoaderState, Props } from "./error-container-drawer.component";
import { ScheduleErrorActionType } from "../../../state/schedule-data/schedule-errors/schedule-errors.reducer";
import { t } from "../../../helpers/translations.helper";
import { colors } from "../../../assets/colors";

interface ErrorLoaderOptions {
  state?: Props;
  errors?: ScheduleErrorMessageModel[];
  isNetworkError?: boolean;
  setOpen: (boolean) => void;
}

export default function LoadingErrorsViewComponent(options: ErrorLoaderOptions): JSX.Element {
  const { setOpen, isNetworkError } = options;
  const [spinnerAgain, setSpinnerAgain] = useState(false);
  const { primaryRevision } = useSelector((app: ApplicationStateModel) => app.actualState);

  const dispatcher = useDispatch();

  function closeDrawer(): void {
    setOpen(false);
  }

  const schedule = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present
  );
  const reload = React.useCallback(() => {
    async function updateScheduleErrors(): Promise<void> {
      if (schedule) {
        let response: ScheduleError[];
        try {
          response = await backend.getErrors(schedule, primaryRevision);
        } catch (err) {
          response = [
            {
              kind: NetworkErrorCode.NETWORK_ERROR,
            },
          ];
        }
        dispatcher({
          type: ScheduleErrorActionType.UPDATE,
          payload: response,
        } as ActionModel<ScheduleError[]>);
      }
    }
    setSpinnerAgain(true);
    updateScheduleErrors();
    setTimeout(() => setSpinnerAgain(false), 4000);
  }, [dispatcher, primaryRevision, schedule]);

  return (
    <>
      {(options.state?.state === ErrorLoaderState.CHECKING || spinnerAgain) && (
        <Wrapper>
          <Content>
            <Spinner />
            <ErrorLoadingText>Trwa sprawdzanie planu</ErrorLoadingText>
          </Content>
        </Wrapper>
      )}
      {isNetworkError && !spinnerAgain && options.state?.state !== ErrorLoaderState.CHECKING && (
        <Wrapper>
          <Content>
            <Image src={warning} alt="" />
            <ErrorLoadingText>Błąd podczas sprawdzania</ErrorLoadingText>
            <ErrorButton variant="primary" onClick={reload}>
              Spróbuj ponownie
            </ErrorButton>
          </Content>
        </Wrapper>
      )}
      {options.state?.state === ErrorLoaderState.ERRORS && !isNetworkError && (
        <>
          <Title>
            {t("errors")}: {options.errors?.length}
          </Title>
          <ErrorList errors={options.errors} />
        </>
      )}
      {options.state?.state === ErrorLoaderState.NOERRORS && (
        <Wrapper>
          <Content>
            <Image src={ok} alt="" />
            <ErrorLoadingText>Plan nie zawiera błędów</ErrorLoadingText>
            <ErrorButton variant="primary" onClick={closeDrawer}>
              Wróć do planu
            </ErrorButton>
          </Content>
        </Wrapper>
      )}
    </>
  );
}

const Title = styled.h3`
  color: ${colors.errorRed};
`;
const ErrorLoadingText = styled.div`
  display: block;
  margin: auto;
  text-align: center;
  font-weight: 500;
  size: 16px;
  line-height: 28px;
  color: ${colors.primary};
  clear: both;
  position: relative;
  top: 27px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ErrorButton = styled(Button)`
  display: block;
  margin: auto;
  position: relative;
  top: 41px;
`;
const Image = styled.img`
  display: block;
  margin: auto;
  width: 55px;
  height: 49px;
`;
const Spinner = styled.div`
  display: block;
  margin: auto;
  text-indent: -9999em;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #ffffff;
  background: linear-gradient(to right, ${colors.primary} 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  animation: load3 1.4s infinite linear;
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background: ${colors.primary};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }

  &:after {
    background: #ffffff;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  @-webkit-keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
