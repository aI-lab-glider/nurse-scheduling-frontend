/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useState, useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function useComponentVisible(initialIsVisible: boolean): any {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  useEffect((): any => {
    const handleClickOutside = (event): void => {
      if (ref.current && !(ref.current! as any).contains(event.target)) {
        setIsComponentVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return (): any => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
