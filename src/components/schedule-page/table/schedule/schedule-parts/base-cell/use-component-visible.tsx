/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useState, useEffect, useRef, RefObject } from "react";

interface ComponentVisibleInterace {
  ref: RefObject<HTMLElement>;
  isComponentVisible: boolean;
  setIsComponentVisible: (prevState: boolean) => void;
}

export default function useComponentVisible(initialIsVisible: boolean): ComponentVisibleInterace {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null) as RefObject<HTMLElement>;

  useEffect((): { (): void } => {
    const handleClickOutside = (event): void => {
      if (ref.current && !ref.current!.contains(event.target)) {
        setIsComponentVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return (): void => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
