'use client";'

import { Provider } from "react-redux";
import { createStore, AppStore } from "../lib/store";
import { useRef } from "react";
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = createStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
