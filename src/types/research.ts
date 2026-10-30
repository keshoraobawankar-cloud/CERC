export enum NavigationTab {
  Report = 'report',
  Aggregator = 'aggregator',
  ValuationLab = 'valuation',
  ThesisMonitor = 'monitor',
}

export enum RegulatorType {
  All = 'All',
  SEBI = 'SEBI',
  CERC = 'CERC & Grid India',
  Railways = 'Ministry of Railways',
  MeitY = 'MeitY (DPDP)',
  PNGRB = 'PNGRB & Carbon',
  ExchangeFilings = 'NSE / BSE Filings',
}

export type InstitutionalCall = 'BUY' | 'HOLD' | 'SELL / AVOID';

export interface GroundedSource {
  title: string;
  uri?: string;
}

export interface RegulatoryDispatch {
  id: string;
  headline: string;
  date: string;
  regulator: string;
  tickers: string[];
  category: string;
  verificationStatus: string;
  summary: string;
  transmissionMechanism: string;
  quantitativeTakeaway: string;
  sources: GroundedSource[];
  isLiveSweep?: boolean;
}

export interface CompanyDossier {
  rank: number;
  ticker: string;
  name: string;
  sectorTag: string;
  call: InstitutionalCall;
  callSubtext: string;
  weightAllocation: string;
  latestPrice: string;
  priceContext: string;
  forwardPe: string;
  ebitdaMargin: string;
  netMargin: string;
  debtStatus: string;
  dividendYield: string;
  roce: string;
  moatClassification: string;
  moatVulnerabilityRating: string;
  regulatoryRegime: string;
  whoPays: string;
  revenueClippingModel: string;
  adjacencyEngines: string;
  fixedCostArchitecture: string;
  editorialImage: string;
  imageCaption: string;
  section1Mechanics: string;
  section2MoatStressTest: string;
  section3DriversVsDrags: string;
  section4ValuationDisconnect: string;
  section5AllocationThesis: string;
  validatesThesis: string[];
  breaksThesis: string[];
  keyMonitorables: string[];
}

export interface CouplingStepRow {
  step: string;
  standaloneIex: string;
  coupledGridIndia: string;
  moatImpact: string;
}

export interface IexPivotSegment {
  segment: string;
  shareOfVolume: number;
  growthTrajectory: string;
  couplingShieldStatus: string;
  strategicRead: string;
}

export interface ThesisTriggerItem {
  id: string;
  ticker: 'CAMS' | 'IRCTC' | 'IEX';
  recommendation: InstitutionalCall;
  domain: string;
  triggerParameter: string;
  validationCondition: string;
  breakerCondition: string;
  horizonWindow: string;
}

export interface LiveTickerPulse {
  ticker: string;
  latestPrice: string;
  latestQuarterSummary: string;
  regulatoryPulse: string;
  thesisSignal: string;
  refreshedAt: string;
  sources: GroundedSource[];
}
