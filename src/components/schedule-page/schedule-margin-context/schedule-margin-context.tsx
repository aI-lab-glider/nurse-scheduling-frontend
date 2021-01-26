import React, { createContext, createRef, RefObject, useContext, useEffect, useState } from "react";

export interface ScheduleMarginContextValues {
  scheduleMargin: string;
  setScheduleMargin: (newMargin: string) => void;
  scheduleRef: RefObject<HTMLDivElement>;
  setUsing: (newValue: boolean) => void;
}

export const ScheduleMarginContext = createContext<ScheduleMarginContextValues | null>(null);

export function ScheduleMarginProvider({ children }): JSX.Element {
  const [scheduleMargin, setScheduleMargin] = useState<string>("0px");
  const [using, setUsing] = useState<boolean>(false);

  const scheduleRef = createRef<HTMLDivElement>();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    const scheduleDiv = scheduleRef.current;
    if (scheduleDiv) {
      const scheduleStyle = window.getComputedStyle(scheduleDiv);
      if (using) {
        setScheduleMargin(scheduleStyle.getPropertyValue("margin-right"));
      } else {
        setScheduleMargin("0px");
      }
    }
  }, [scheduleRef, width]);

  return (
    <ScheduleMarginContext.Provider
      value={{ scheduleMargin, setScheduleMargin, scheduleRef, setUsing }}
    >
      {children}
    </ScheduleMarginContext.Provider>
  );
}

export function useScheduleMargin(): ScheduleMarginContextValues {
  const context = useContext(ScheduleMarginContext);

  if (!context) throw new Error("useScheduleMargin have to be used within ScheduleMarginProvider");

  return context;
}
