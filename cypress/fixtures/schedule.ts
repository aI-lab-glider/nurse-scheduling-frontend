/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable @typescript-eslint/camelcase */

import { ScheduleDataModel } from "../../src/state/schedule-data/schedule-data.model";
import {
  ContractType,
  WorkerGroup,
} from "../../src/state/schedule-data/worker-info/worker-info.model";

export default {
  schedule_info: { UUID: "0", month_number: 1, year: 2021 },
  month_info: {
    children_number: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    extra_workers: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    dates: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ],
    frozen_shifts: [],
    holidays: [],
  },
  employee_info: {
    type: {
      "Opiekunka 1": "OTHER",
      "Opiekunka 2": "OTHER",
      "Opiekunka 3": "OTHER",
      "Opiekunka 4": "OTHER",
      "Opiekunka 5": "OTHER",
      "Opiekunka 6": "OTHER",
      "Opiekunka 7": "OTHER",
      "Opiekunka 8": "OTHER",
      "Opiekunka 9": "OTHER",
      "Opiekunka 10": "OTHER",
      "Opiekunka 11": "OTHER",
      "Opiekunka 12": "OTHER",
      "Opiekunka 13": "OTHER",
      "Pielęgniarka 1": "NURSE",
      "Pielęgniarka 2": "NURSE",
      "Pielęgniarka 3": "NURSE",
      "Pielęgniarka 4": "NURSE",
      "Pielęgniarka 5": "NURSE",
      "Pielęgniarka 6": "NURSE",
      "Pielęgniarka 7": "NURSE",
      "Pielęgniarka 8": "NURSE",
      "Pielęgniarka 9": "NURSE",
      "Pielęgniarka 10": "NURSE",
      "Pielęgniarka 11": "NURSE",
    },
    time: {
      "Pielęgniarka 1": 1,
      "Pielęgniarka 2": 1,
      "Pielęgniarka 3": 1,
      "Pielęgniarka 4": 1,
      "Pielęgniarka 5": 1,
      "Pielęgniarka 6": 1,
      "Pielęgniarka 7": 1,
      "Pielęgniarka 8": 1,
      "Pielęgniarka 9": 1,
      "Pielęgniarka 10": 1,
      "Pielęgniarka 11": 1,
      "Opiekunka 1": 1,
      "Opiekunka 2": 1,
      "Opiekunka 3": 1,
      "Opiekunka 4": 1,
      "Opiekunka 5": 1,
      "Opiekunka 6": 1,
      "Opiekunka 7": 1,
      "Opiekunka 8": 1,
      "Opiekunka 9": 1,
      "Opiekunka 10": 1,
      "Opiekunka 11": 1,
      "Opiekunka 12": 1,
      "Opiekunka 13": 1,
    },
    contractType: {
      "Pielęgniarka 1": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 2": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 3": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 4": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 5": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 6": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 7": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 8": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 9": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 10": ContractType.EMPLOYMENT_CONTRACT,
      "Pielęgniarka 11": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 1": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 2": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 3": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 4": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 5": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 6": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 7": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 8": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 9": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 10": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 11": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 12": ContractType.EMPLOYMENT_CONTRACT,
      "Opiekunka 13": ContractType.EMPLOYMENT_CONTRACT,
    },
    workerGroup: {
      "Opiekunka 1": "Zespół 1" as WorkerGroup,
      "Opiekunka 2": "Zespół 1" as WorkerGroup,
      "Opiekunka 3": "Zespół 1" as WorkerGroup,
      "Opiekunka 4": "Zespół 1" as WorkerGroup,
      "Opiekunka 5": "Zespół 1" as WorkerGroup,
      "Opiekunka 6": "Zespół 1" as WorkerGroup,
      "Opiekunka 7": "Zespół 1" as WorkerGroup,
      "Opiekunka 8": "Zespół 1" as WorkerGroup,
      "Opiekunka 9": "Zespół 1" as WorkerGroup,
      "Opiekunka 10": "Zespół 1" as WorkerGroup,
      "Opiekunka 11": "Zespół 1" as WorkerGroup,
      "Opiekunka 12": "Zespół 1" as WorkerGroup,
      "Opiekunka 13": "Zespół 1" as WorkerGroup,
      "Pielęgniarka 1": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 2": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 3": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 4": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 5": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 6": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 7": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 8": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 9": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 10": "Zespół 2" as WorkerGroup,
      "Pielęgniarka 11": "Zespół 2" as WorkerGroup,
    },
  },
  shifts: {
    "Opiekunka 1": [
      "W",
      "W",
      "D",
      "N",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "D",
      "W",
      "W",
      "D",
      "N",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "D",
      "W",
      "W",
      "D",
      "N",
    ],
    "Opiekunka 2": [
      "W",
      "W",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "W",
      "N",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "D",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "D",
    ],
    "Opiekunka 3": [
      "W",
      "W",
      "D",
      "D",
      "N",
      "W",
      "D",
      "N",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "DN",
    ],
    "Opiekunka 4": [
      "W",
      "W",
      "D",
      "R",
      "N",
      "W",
      "D",
      "RPN",
      "W",
      "W",
      "RP",
      "DN",
      "W",
      "W",
      "D",
      "DN",
      "W",
      "W",
      "RP",
      "N",
      "W",
      "W",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
    ],
    "Opiekunka 5": [
      "W",
      "W",
      "D",
      "W",
      "N",
      "W",
      "R",
      "N",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "D",
      "W",
      "N",
      "W",
      "W",
      "D",
      "W",
      "W",
      "W",
      "D",
    ],
    "Opiekunka 6": [
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
    ],
    "Opiekunka 7": [
      "N",
      "W",
      "W",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "W",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "D",
      "N",
      "N",
      "W",
      "W",
      "DN",
    ],
    "Opiekunka 8": [
      "N",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "W",
    ],
    "Opiekunka 9": [
      "N",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "D",
      "D",
      "N",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "W",
      "D",
      "N",
      "W",
      "D",
      "N",
    ],
    "Opiekunka 10": [
      "N",
      "W",
      "D",
      "DN",
      "W",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "R",
      "D",
      "N",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "W",
      "N",
      "W",
      "D",
      "D",
    ],
    "Opiekunka 11": [
      "W",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "W",
      "W",
    ],
    "Opiekunka 12": [
      "R",
      "R",
      "R",
      "R",
      "R",
      "W",
      "W",
      "R",
      "R",
      "R",
      "R",
      "R",
      "W",
      "W",
      "R",
      "R",
      "R",
      "R",
      "R",
      "W",
      "W",
      "R",
      "R",
      "R",
      "R",
      "R",
      "W",
      "W",
    ],
    "Opiekunka 13": [
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
    ],
    "Pielęgniarka 1": [
      "D",
      "D",
      "W",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "DN",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "DN",
      "W",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "W",
      "W",
    ],
    "Pielęgniarka 2": [
      "W",
      "D",
      "N",
      "W",
      "P1",
      "DN",
      "W",
      "U",
      "U",
      "U",
      "U",
      "U",
      "W",
      "D",
      "W",
      "W",
      "D",
      "PN",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
      "D",
      "D",
      "W",
      "W",
    ],
    "Pielęgniarka 3": [
      "D",
      "N",
      "W",
      "W",
      "D",
      "W",
      "N",
      "W",
      "D",
      "PN",
      "W",
      "W",
      "D",
      "W",
      "N",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "W",
      "N",
      "W",
    ],
    "Pielęgniarka 4": [
      "R",
      "R",
      "W",
      "W",
      "R",
      "D",
      "W",
      "W",
      "R",
      "R",
      "W",
      "W",
      "D",
      "D",
      "W",
      "W",
      "R",
      "R",
      "W",
      "W",
      "D",
      "R",
      "W",
      "W",
      "R",
      "R",
      "W",
      "W",
    ],
    "Pielęgniarka 5": [
      "W",
      "N",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "N",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "N",
      "W",
      "D",
      "N",
      "N",
      "W",
      "W",
      "N",
      "N",
      "W",
    ],
    "Pielęgniarka 6": [
      "W",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
      "W",
      "W",
      "N",
      "W",
      "W",
      "W",
      "N",
      "W",
      "W",
      "D",
      "W",
      "W",
      "W",
      "W",
      "D",
      "N",
      "W",
    ],
    "Pielęgniarka 7": [
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "U",
      "D",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "N",
      "W",
      "W",
    ],
    "Pielęgniarka 8": [
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "N",
      "W",
      "D",
      "RP",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "D",
      "W",
      "W",
    ],
    "Pielęgniarka 9": [
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "W",
      "W",
      "W",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
    ],
    "Pielęgniarka 10": [
      "D",
      "D",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "D",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "W",
      "U",
      "U",
      "U",
      "U",
      "N",
      "W",
      "W",
      "D",
      "W",
      "N",
      "W",
    ],
    "Pielęgniarka 11": [
      "P1",
      "DN",
      "W",
      "W",
      "R",
      "DN",
      "W",
      "W",
      "P1",
      "D",
      "N",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "R",
      "W",
      "W",
      "W",
      "D",
      "N",
      "W",
      "D",
      "N",
      "W",
      "W",
    ],
  },
  isAutoGenerated: false,
  isCorrupted: false,
  shift_types: {
    R: { code: "R", name: "Rano", from: 7, to: 15, color: "FFD100", isWorkingShift: true },
    P: { code: "P", name: "Popołudnie", from: 15, to: 19, color: "00A3FF", isWorkingShift: true },
    D: { code: "D", name: "Dzień", from: 7, to: 19, color: "73B471", isWorkingShift: true },
    N: { code: "N", name: "Noc", from: 19, to: 7, color: "1D3557", isWorkingShift: true },
    DN: { code: "DN", name: "Dzień + Noc", from: 7, to: 7, color: "641EAA", isWorkingShift: true },
    PN: {
      code: "PN",
      name: "Popołudnie + Noc",
      from: 19,
      to: 7,
      color: "FFD100",
      isWorkingShift: true,
    },
    W: { code: "W", name: "Wolne", from: 0, to: 24, color: "FF8A00", isWorkingShift: false },
    U: {
      code: "U",
      name: "Urlop wypoczynkowy",
      from: 0,
      to: 24,
      color: "FF8A00",
      isWorkingShift: false,
    },
    L4: {
      code: "L4",
      name: "Zwolnienie lekarskie (L4)",
      from: 0,
      to: 24,
      color: "C60000",
      isWorkingShift: false,
    },
    K: {
      code: "K",
      name: "Kwarantanna",
      from: 0,
      to: 24,
      color: "000000",
      isWorkingShift: false,
    },
    RP: {
      code: "RP",
      name: "rano, popołudnie",
      from: 7,
      to: 19,
      color: "FFD100",
      isWorkingShift: true,
    },
    RPN: {
      code: "RPN",
      name: "rano, popołudnie, noc",
      from: 7,
      to: 7,
      color: "9025cf",
      isWorkingShift: true,
    },
    N8: {
      code: "N8",
      name: "noc 8h",
      from: 23,
      to: 7,
      color: "76a877",
      isWorkingShift: true,
    },
    DN8: {
      code: "DN8",
      name: "dzień, noc 8h",
      from: 22,
      to: 19,
      color: "c9592e",
      isWorkingShift: true,
    },
    D1: {
      code: "D1",
      name: "dzień 1",
      from: 7,
      to: 17,
      color: "396e75",
      isWorkingShift: true,
    },
    D2: {
      code: "D2",
      name: "dzień 2",
      from: 7,
      to: 16,
      color: "eda81c",
      isWorkingShift: true,
    },
    P1: {
      code: "P1",
      name: "popołudnie 1",
      from: 15,
      to: 21,
      color: "2003fc",
      isWorkingShift: true,
    },
    R1: {
      code: "R1",
      name: "rano 1",
      from: 7,
      to: 13,
      color: "5ce6dc",
      isWorkingShift: true,
    },
  },
} as ScheduleDataModel;
