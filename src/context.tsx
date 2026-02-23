import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Airline, GradientConfig } from "./types";
import { loadAirlines, loadConfig, saveAirlines, saveConfig } from "./store";

interface AppState {
  airlines: Airline[];
  config: GradientConfig;
  ready: boolean;
  addAirline: (a: Airline) => void;
  updateAirline: (a: Airline) => void;
  removeAirline: (id: string) => void;
  importAirlines: (list: Airline[]) => void;
  setConfig: (c: GradientConfig) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [config, _setConfig] = useState<GradientConfig>({ single: [], dual: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadAirlines(), loadConfig()]).then(([a, c]) => {
      setAirlines(a);
      _setConfig(c);
      setReady(true);
    });
  }, []);

  const persist = (next: Airline[]) => {
    setAirlines(next);
    saveAirlines(next);
  };

  const addAirline = useCallback(
    (a: Airline) => persist([...airlines, a]),
    [airlines],
  );

  const updateAirline = useCallback(
    (a: Airline) => persist(airlines.map((x) => (x.id === a.id ? a : x))),
    [airlines],
  );

  const removeAirline = useCallback(
    (id: string) => persist(airlines.filter((x) => x.id !== id)),
    [airlines],
  );

  const importAirlines = useCallback((list: Airline[]) => {
    const merged = [...airlines];
    for (const a of list) {
      const idx = merged.findIndex((x) => x.id === a.id);
      if (idx >= 0) merged[idx] = a;
      else merged.push(a);
    }
    persist(merged);
  }, [airlines]);

  const setConfig = useCallback((c: GradientConfig) => {
    _setConfig(c);
    saveConfig(c);
  }, []);

  return (
    <Ctx.Provider value={{ airlines, config, ready, addAirline, updateAirline, removeAirline, importAirlines, setConfig }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
