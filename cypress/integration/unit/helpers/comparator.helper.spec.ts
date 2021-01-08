/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ComparatorHelper, Order } from "../../../../src/helpers/comparator.helper";

interface ComplexType {
  street: string;
  number: number;
}
interface TestType {
  id: number;
  name: string;
  age: number;
  address: ComplexType;
}
interface TestCase {
  message?: string;
  arr: TestType[];
  order: Order;
  orderBy: keyof TestType;
  expected: TestType[];
}

const testObject1: TestType = { id: 1, name: "a", age: 1, address: { street: "za", number: 13 } };
const testObject2: TestType = { id: 2, name: "ab", age: 3, address: { street: "x", number: 11 } };
const testObject3: TestType = { id: 3, name: "bc", age: 2, address: { street: "y", number: 12 } };

const stableSort: TestCase[] = [
  {
    arr: [testObject1, testObject2, testObject3],
    order: "asc",
    orderBy: "name",
    expected: [testObject1, testObject2, testObject3],
  },
  {
    arr: [testObject1, testObject2, testObject3],
    order: "desc",
    orderBy: "name",
    expected: [testObject3, testObject2, testObject1],
  },
  {
    arr: [testObject1, testObject2, testObject3],
    order: "asc",
    orderBy: "age",
    expected: [testObject1, testObject3, testObject2],
  },
  {
    arr: [testObject1, testObject2, testObject3],
    order: "desc",
    orderBy: "age",
    expected: [testObject2, testObject3, testObject1],
  },
  {
    message: "comparing complex type should return the same order",
    arr: [testObject1, testObject2, testObject3],
    order: "asc",
    orderBy: "address",
    expected: [testObject1, testObject2, testObject3],
  },
  {
    message: "comparing complex type should return the same order",
    arr: [testObject1, testObject2, testObject3],
    order: "desc",
    orderBy: "address",
    expected: [testObject1, testObject2, testObject3],
  },
  {
    arr: [testObject1],
    order: "desc",
    orderBy: "address",
    expected: [testObject1],
  },
];

describe("ComparatorHelper", () => {
  stableSort.forEach((testCase) => {
    describe("Stable sort test", () => {
      const message = `Should sort objects:
       ${testCase.arr
         .map((o) => `id: ${o.id},${testCase.orderBy}: ${JSON.stringify(o[testCase.orderBy])}`)
         .join(",\n")}
       in ${testCase.order} order comparing ${testCase.orderBy} and gave result equal:
        ${testCase.expected
          .map((o) => `id: ${o.id},${testCase.orderBy}: ${JSON.stringify(o[testCase.orderBy])}`)
          .join(",\n")}
        ${testCase.message ? `because ${testCase.message}` : ""} `;

      it(message, () => {
        const result = ComparatorHelper.stableSort(testCase.arr, testCase.order, testCase.orderBy);
        cy.log(`Got result\n ${JSON.stringify(result)}`);
        expect(result).to.eql(testCase.expected);
      });
    });
  });
});
