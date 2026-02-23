import { openDB } from "idb";
import type { Airline, GradientConfig } from "./types";

const DB_NAME = "airline-gradient";
const DB_VERSION = 1;
const STORE = "config";

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

const DEFAULT_AIRLINES: Airline[] = [
  { id: "6E", name: "IndiGo", tokens: ["#E8E1F0", "#A78BDB", "#5926A1", "#3F0F6F"] },
  { id: "AI", name: "Air India", tokens: ["#F2D4D8", "#E06B7F", "#C42847", "#8B1A1A"] },
  { id: "SG", name: "SpiceJet", tokens: ["#FFD6CC", "#FF7F50", "#FF4500", "#CC0000"] },
  { id: "UK", name: "Vistara", tokens: ["#E3D5F1", "#A07BD4", "#6C3B9E", "#4B2067"] },
];

const DEFAULT_CONFIG: GradientConfig = {
  single: [
    { position: 0, tokenIndex: 0 },
    { position: 33, tokenIndex: 1 },
    { position: 66, tokenIndex: 2 },
    { position: 100, tokenIndex: 3 },
  ],
  dual: [
    { position: 0, airlineIndex: 0, tokenIndex: 0 },
    { position: 30, airlineIndex: 0, tokenIndex: 1 },
    { position: 70, airlineIndex: 1, tokenIndex: 2 },
    { position: 100, airlineIndex: 1, tokenIndex: 3 },
  ],
};

export async function loadAirlines(): Promise<Airline[]> {
  const db = await getDB();
  const val = await db.get(STORE, "airlines");
  return val ?? DEFAULT_AIRLINES;
}

export async function saveAirlines(airlines: Airline[]) {
  const db = await getDB();
  await db.put(STORE, airlines, "airlines");
}

export async function loadConfig(): Promise<GradientConfig> {
  const db = await getDB();
  const val = await db.get(STORE, "config");
  return val ?? DEFAULT_CONFIG;
}

export async function saveConfig(config: GradientConfig) {
  const db = await getDB();
  await db.put(STORE, config, "config");
}
