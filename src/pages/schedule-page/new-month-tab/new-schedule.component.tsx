/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import * as S from "./new-schedule.styled";
import nurse from "../../../assets/images/nurse.png";
import { EmptyMonthButtons } from "../../../components/buttons/empty-month-buttons/empty-month-buttons";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { FirebaseReducer, isLoaded, useFirestore } from "react-redux-firebase";
import { isEmpty } from "lodash";
import { getPresentScheduleInfo } from "../../../state/schedule-data/selectors";
import { ScheduleKey } from "../../../logic/data-access/persistance-store.model";
import { ScheduleDataActionCreator } from "../../../state/schedule-data/schedule-data.action-creator";
import { ScheduleDataModel } from "../../../state/schedule-data/schedule-data.model";
import { t } from "../../../helpers/translations.helper";
import { Spinner } from "../../../components/Spinner";

export function NewScheduleComponent(): JSX.Element {
  const [IsCloudScheduleSaved, setIsCloudScheduleSaved] = useState(false);

  const firestore = useFirestore();
  const scheduleDipatcher = useDispatch();

  const { month_number: currentMonth, year: currentYear } = useSelector(getPresentScheduleInfo);

  const auth = useSelector<RootStateOrAny, FirebaseReducer.AuthState>(
    (state) => state.firebase.auth
  );

  const org = useSelector<RootStateOrAny, string>((state) => state.firebase.profile.org);

  const isLoggedIn = !isEmpty(auth) && isLoaded(auth);

  useEffect(() => {
    if (isLoaded(org) && !isEmpty(org)) {
      const scheduleKey = new ScheduleKey(currentMonth, currentYear);
      firestore
        .collection("organizations")
        .doc(org)
        .collection("schedules")
        .doc(scheduleKey.getRevisionKey("actual"))
        .get()
        .then((doc) => {
          if (doc.exists) {
            setIsCloudScheduleSaved(true);
            const schedule = doc.data() as ScheduleDataModel;
            scheduleDipatcher(ScheduleDataActionCreator.setScheduleStateAndSaveToDb(schedule));
          }
        })
        .catch(() => setIsCloudScheduleSaved(false));
    }
  }, [org]);

  return (
    <S.Wrapper>
      {isLoggedIn && IsCloudScheduleSaved ? (
        <>
          <S.Image src={nurse} alt="" />
          <S.Message>Pobieram zapisany plan</S.Message>
          <Spinner />
        </>
      ) : (
        <>
          <S.Image src={nurse} alt="" />
          <S.Message>{t("youdonthaveplanforthismonth")}</S.Message>
          <EmptyMonthButtons />
        </>
      )}
    </S.Wrapper>
  );
}
