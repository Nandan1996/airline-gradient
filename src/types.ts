export interface Airline {
  id: string;
  name: string;
  tokens: [string, string, string, string];
}

export interface StopEntry {
  position: number;
  tokenIndex: number; // 0-3 index into airline tokens
}

export interface DualStopEntry {
  position: number;
  airlineIndex: 0 | 1; // which airline (first or second)
  tokenIndex: number;  // 0-3
}

export interface GradientConfig {
  single: StopEntry[];
  dual: DualStopEntry[];
}
