import React, { createContext, useContext, useState } from "react";

export interface JiraLikeDrawerContextValues {
  title: string | undefined;
  setTitle: (title: string) => void;
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  childrenComponent: JSX.Element | undefined;
  setChildrenComponent: (component: JSX.Element) => void;
}

export const JiraLikeDrawerContext = createContext<JiraLikeDrawerContextValues | null>(null);

export function JiraLikeDrawerProvider({ children }): JSX.Element {
  const [title, setTitle] = useState<string>();
  const [open, setOpen] = useState<boolean>();
  const [childrenComponent, setChildrenComponent] = useState<JSX.Element>();

  return (
    <JiraLikeDrawerContext.Provider
      value={{
        title,
        setTitle,
        open,
        setOpen,
        childrenComponent,
        setChildrenComponent,
      }}
    >
      {children}
    </JiraLikeDrawerContext.Provider>
  );
}

export function useJiraLikeDrawer(): JiraLikeDrawerContextValues {
  const context = useContext(JiraLikeDrawerContext);

  if (!context) throw new Error("useJiraLikeDrawer have to be used within JiraLikeDrawerProvider");

  return context;
}
