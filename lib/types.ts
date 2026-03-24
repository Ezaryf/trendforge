export type Horizon = "7d" | "30d" | "90d";

export type SignalBreakdown = {
  momentum: number;
  acceleration: number;
  maintenanceHealth: number;
  contributorActivity: number;
  releaseCadence: number;
  socialBuzz: number;
  ecosystemSimilarity: number;
};

export type ForecastPoint = {
  day: number;
  stars: number;
  segment: "historical" | "forecast";
};

export type Driver = {
  title: string;
  impact: number;
  detail: string;
};

export type SimilarRepo = {
  owner: string;
  repo: string;
  score: number;
  category: string;
};

export type RepoSummary = {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  contributors: number;
  releases: number;
  lastPush: string;
  category: string;
  url: string;
};

export type ScanResponse = {
  horizon: Horizon;
  breakoutProbability: number;
  trendScore: number;
  confidenceBand: {
    low: number;
    mid: number;
    high: number;
  };
  predictedGrowthCurve: ForecastPoint[];
  topDrivers: Driver[];
  riskFactors: string[];
  similarRepos: SimilarRepo[];
  signalBreakdown: SignalBreakdown;
  repo: RepoSummary;
  narrative: string;
};

export type ExploreResponse = {
  horizon: Horizon;
  generatedAt: string;
  items: ScanResponse[];
};

export type CompareResponse = {
  horizon: Horizon;
  left: ScanResponse;
  right: ScanResponse;
  winner: string;
  summary: string;
};
