/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect, useState } from "react";

export type SelectionMatrix = boolean[][];

export function areDimesionsEqual(matrix1: unknown[][], matrix2: unknown[][]): boolean {
  return matrix1.length === matrix2.length && matrix1[0].length === matrix2[0].length;
}

interface UseSelectionMatrixReturn {
  setSelectionMatrix: (
    source: SelectionMatrix,
    x: number,
    y: number,
  ) => void;
  selectionMatrix: SelectionMatrix;
  resetSelectionMatrix: () => void;
}

export function useSelectionMatrix(matrix: unknown[][]): UseSelectionMatrixReturn {
  const [selectionMatrix, setSelectionMatrix] = useState<SelectionMatrix>(getFalsyCopy(matrix));

  useEffect(() => {
    if (!areDimesionsEqual(matrix, selectionMatrix)) {
      setSelectionMatrix(getFalsyCopy(matrix));
    }
  }, [selectionMatrix, matrix, setSelectionMatrix]);

  function getFalsyCopy(source: unknown[][]): SelectionMatrix {
    return [...Array(source.length)].map((_) => Array(source[0].length).fill(false));
  }

  function setSelection(
    source: SelectionMatrix,
    x: number,
    y: number,
  ): void {
    const selection = getFalsyCopy(source);
    selection[y][x] = true;
    setSelectionMatrix(selection);
  }

  function resetSelection(): void {
    setSelectionMatrix((prev) => getFalsyCopy(prev));
  }

  return {
    selectionMatrix,
    setSelectionMatrix: setSelection,
    resetSelectionMatrix: resetSelection,
  };
}
