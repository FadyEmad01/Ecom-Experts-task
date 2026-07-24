"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore } from "zustand";
import type { BundleStoreState } from "@/stores/bundle-store";
import { createBundleStore } from "@/stores/bundle-store";

type BundleStoreApi = ReturnType<typeof createBundleStore>;

const BundleStoreContext = createContext<BundleStoreApi | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<BundleStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createBundleStore();
  }

  useEffect(() => {
    storeRef.current?.persist.rehydrate();
  }, []);

  return (
    <BundleStoreContext.Provider value={storeRef.current}>
      {children}
    </BundleStoreContext.Provider>
  );
}

export function useBundleStore<T>(selector: (state: BundleStoreState) => T): T {
  const store = useContext(BundleStoreContext);
  if (!store) {
    throw new Error("useBundleStore must be used within BundleProvider");
  }
  return useStore(store, selector);
}
