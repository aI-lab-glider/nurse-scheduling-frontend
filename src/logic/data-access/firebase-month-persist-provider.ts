/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import firebase from "firebase/app";
import "firebase/firestore";
import { cloneDeep } from "lodash";
import { MonthDataModel } from "../../state/schedule-data/schedule-data.model";
import { MonthDMToRevisionKeyDict, MonthPersistProvider } from "./month-persistance-provider";
import { RevisionKey, RevisionType, ScheduleKey } from "./persistance-store.model";
// https://www.freecodecamp.org/news/how-to-build-a-todo-application-using-reactjs-and-firebase/

const SCHEDULES_COLLECTION = "schedules";
export class FirebaseMonthPersistProvider extends MonthPersistProvider {

  private firestore: firebase.firestore.Firestore;

  constructor () {
    super();
    this.firestore = this.createFirebaseAdmin().firestore();
  }

  private createFirebaseAdmin() {
    return firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    });
  }

  async saveMonth(revisionKey: RevisionType, monthDataModel: MonthDataModel): Promise<void> {
    const dataToSave = cloneDeep(monthDataModel);
    dataToSave.scheduleKey = (dataToSave.scheduleKey.getRevisionKey(
      revisionKey
    ) as unknown) as ScheduleKey;
    const monthKey = monthDataModel.scheduleKey.getRevisionKey(revisionKey);

    this.firestore.collection(SCHEDULES_COLLECTION).doc(monthKey).set(dataToSave);
  }

  async getMonth(revisionKey: string): Promise<MonthDataModel> {
    const schedule = ((
      await this.firestore.collection(SCHEDULES_COLLECTION).doc(`/${revisionKey.toString()}/`).get()
    ).data() as unknown) as MonthDataModel;
    if (schedule) {
      schedule.scheduleKey = ScheduleKey.fromRevisionKey(
        (schedule.scheduleKey as unknown) as RevisionKey
      );
    }
    return (schedule as unknown) as MonthDataModel;
  }

  async reloadDb(): Promise<void> {
    this.firestore.clearPersistence();
  }

  async getAllMonths(): Promise<MonthDMToRevisionKeyDict> {
    const schedules = await this.firestore.doc("/");
    return (schedules as unknown) as MonthDMToRevisionKeyDict;
  }
}
