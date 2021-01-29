import React, { createContext, useContext, useState } from "react";

export interface ScheduleMarginContextValues {
  scheduleMargin: string;
  setScheduleMargin: (newMargin: string) => void;
}

export const ScheduleMarginContext = createContext<ScheduleMarginContextValues | null>(null);

export function ScheduleMarginProvider({ children }): JSX.Element {
  const [scheduleMargin, setScheduleMargin] = useState<string>("0px");

  return (
    <ScheduleMarginContext.Provider value={{ scheduleMargin, setScheduleMargin }}>
      {children}
    </ScheduleMarginContext.Provider>
  );
}

export function useScheduleMargin(): ScheduleMarginContextValues {
  const context = useContext(ScheduleMarginContext);

  if (!context) throw new Error("useScheduleMargin have to be used within ScheduleMarginProvider");

  return context;
}
