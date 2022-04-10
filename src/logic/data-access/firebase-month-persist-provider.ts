/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import firebase from "firebase/app";
import "firebase/firestore";
import { cloneDeep, isNull } from "lodash";
import { MonthDataModel } from "../../state/schedule-data/schedule-data.model";
import { MonthDMToRevisionKeyDict, MonthPersistProvider } from "./month-persistance-provider";
import { RevisionKey, RevisionType, ScheduleKey } from "./persistance-store.model";
import { store } from "../../index";
//https://www.freecodecamp.org/news/how-to-build-a-todo-application-using-reactjs-and-firebase/

const SCHEDULES_COLLECTION = "schedules";

export class FirebaseMonthPersistProvider extends MonthPersistProvider {
  private firestore: firebase.firestore.Firestore | null;

  private auth: firebase.User | null;

  constructor() {
    super();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.auth = firebase.auth().currentUser;
        this.firestore = firebase.firestore();
      }
    });
  }

  async saveMonth(revisionKey: RevisionType, monthDataModel: MonthDataModel): Promise<void> {
    if (!isNull(this.auth)) {
      const dataToSave = cloneDeep(monthDataModel);
      console.log("save");
      dataToSave.scheduleKey = (dataToSave.scheduleKey.getRevisionKey(
        revisionKey
      ) as unknown) as ScheduleKey;
      const monthKey = monthDataModel.scheduleKey.getRevisionKey(revisionKey);
      // this.firestore.collection(SCHEDULES_COLLECTION).doc(monthKey).set(dataToSave);
    }
  }

  async getMonth(revisionKey: string): Promise<MonthDataModel> {
    let schedule;
    if (!isNull(this.auth) && this.firestore) {
      schedule = ((
        await this.firestore
          .collection("organizations")
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .doc(store.getState().firebase.profile.org)
          .collection("schedules")
          .doc(revisionKey)
          .get()
      ).data() as unknown) as MonthDataModel;
      if (schedule) {
        schedule.scheduleKey = ScheduleKey.fromRevisionKey(
          (schedule.scheduleKey as unknown) as RevisionKey
        );
      }
    }

    return (schedule as unknown) as MonthDataModel;
  }

  async reloadDb(): Promise<void> {
    this.firestore.clearPersistence();
  }

  async getAllMonths(): Promise<MonthDMToRevisionKeyDict> {
    const schedules = (await this.firestore.doc("/")) || null;
    return (schedules as unknown) as MonthDMToRevisionKeyDict;
  }
}
export {};
