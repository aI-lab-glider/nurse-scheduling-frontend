/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import axios from "axios";

const latestReleaseRequest =
  "https://api.github.com/repos/Project-Summer-AI-Lab-Glider/nurse-scheduling-problem-frontend/releases/latest";

export const getLatestAppVersion = axios
  .get(latestReleaseRequest)
  .then((res) => {
    return res.data.name;
  })
  .catch(() => {
    return;
  });
