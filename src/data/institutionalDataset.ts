import type {
  CompanyDossier,
  CouplingStepRow,
  IexPivotSegment,
  RegulatoryDispatch,
  ThesisTriggerItem,
} from '../types/research';

export const REPORT_METADATA = {
  title: 'CAMS vs. IRCTC vs. IEX: Institutional Moat, Regulatory Stress & Capital Allocation Analysis',
  subtitle: 'Comparative Coverage: Indian Financial Infrastructure, Sovereign Bottlenecks & Market Exchanges',
  horizon: '12-to-24-Month Investment Horizon',
  desk: 'India Financial Markets, Infrastructure & PSU Research Desk',
  date: 'October 2026',
  bottomLine:
    'Institutional Portfolio Ranking: #1 CAMS — BUY (Core Compounder, 60% Sleeve Weight), #2 IRCTC — HOLD (Sovereign Volume Toll, 30% Weight), #3 IEX — SELL / AVOID (0% Fresh Core Capital / Max 10% Tactical Cap). While all three operate asset-light tollbooths, CAMS pairs regressive AUM basis-point slabs (0.02%–0.05%) with compounding SIP inflows, astronomical KFintech switching friction, and DPDP-compliant KRA expansion; IRCTC layers 430M+ high-margin e-tickets (₹15 Non-AC / ₹30 AC) with sealed-window Vande Bharat Sleeper catering growth against structural Ministry fee-split risk; and IEX faces CERC Market Coupling via Grid India, where a ~66% Net Profit Margin, zero debt, and ~3.45% dividend yield near 52-week lows mask severe post-coupling fee-compression risk.',
};

export interface MonetizationFlowVector {
  ticker: 'CAMS' | 'IRCTC' | 'IEX';
  originNode: string;
  inboundFlow: string;
  intermediaryNode: string;
  pricingClip: string;
  counterpartyNode: string;
  pricingNuance: string;
}

export const MONETIZATION_VECTORS: MonetizationFlowVector[] = [
  {
    ticker: 'CAMS',
    originNode: 'Retail & Institutional Investor',
    inboundFlow: 'Monthly SIP & Lumpsum AUM Flow',
    intermediaryNode: 'CAMS (RTA & KRA)',
    pricingClip: '0.02%–0.05% Tiered Bps Fee',
    counterpartyNode: 'Asset Management Co. (AMC)',
    pricingNuance:
      'Slab-based regressive AUM pricing: percentage bps dips slightly as an equity scheme scales massive, but structural SIP inflow velocity consistently outpaces tiering compression.',
  },
  {
    ticker: 'IRCTC',
    originNode: 'Rail Passenger (430M+ e-Tickets/Yr)',
    inboundFlow: 'UPI / Net-Banking Convenience & Meals',
    intermediaryNode: 'IRCTC (Statutory PSU)',
    pricingClip: '₹15 Non-AC / ₹30 AC + License Share',
    counterpartyNode: 'Ministry of Railways',
    pricingNuance:
      'Virtually 100% gross margin on sunk ticketing software, layered with ~1.5M liters/day Rail Neer water plants (tight fixed margins) and hefty third-party onboard catering vendor license shares.',
  },
  {
    ticker: 'IEX',
    originNode: 'Power Generator & State Discom',
    inboundFlow: 'Matched Spot MWh / kWh Volume',
    intermediaryNode: 'IEX (96-Block Terminal)',
    pricingClip: '2 Paise Buyer + 2 Paise Seller / Unit',
    counterpartyNode: 'National Power Grid Clearing',
    pricingNuance:
      'Pure double-sided volume clipping (₹0.02/kWh each side = ₹0.04/kWh total), completely decoupled from whether spot electricity clearing prices are high or low.',
  },
];

export interface PortfolioCheckpointItem {
  ticker: 'CAMS' | 'IRCTC' | 'IEX';
  archetype: string;
  call: string;
  checkpointSummary: string;
  primaryWatchMetric: string;
}

export const PORTFOLIO_REVIEW_CHECKLIST: PortfolioCheckpointItem[] = [
  {
    ticker: 'CAMS',
    archetype: 'Secular Financialization Compounder',
    call: 'BUY · 60% Allocation',
    checkpointSummary:
      'Deploy core compounding capital here to capture India’s structural middle-class migration into mutual funds, systematic investment plans (SIPs), and DPDP-compliant KRA data onboarding.',
    primaryWatchMetric: 'Monthly live SIP market share (>63%) & realized AMC renewal bps compression (<3%/yr)',
  },
  {
    ticker: 'IRCTC',
    archetype: 'Infrastructure-Backed Sovereign Volume Play',
    call: 'HOLD · 30% Allocation',
    checkpointSummary:
      'Hold for high-certainty passenger volume scaling across sealed-window Vande Bharat Sleeper and Amrit Bharat corridors, while maintaining strict position sizing against public-sector policy pivots.',
    primaryWatchMetric: '100% convenience-fee retention status & Vande Bharat Sleeper catering margin conversion',
  },
  {
    ticker: 'IEX',
    archetype: 'Deep-Value Turnaround / Regulatory Watch',
    call: 'SELL / AVOID · 0–10% Cap',
    checkpointSummary:
      'Rare debt-free franchise with a ~66% net profit margin and ~3.45% yield at compressed multiples, but avoid fresh capital until CERC Market Coupling timelines clarify whether the dividend floor is safe from fee wars.',
    primaryWatchMetric: 'Grid India DAM coupling go-live order & post-coupling PXIL/HPX transaction fee schedules',
  },
];

export const COMPANY_DOSSIERS: CompanyDossier[] = [
  {
    rank: 1,
    ticker: 'CAMS',
    name: 'Computer Age Management Services Ltd.',
    sectorTag: 'Financial Market Infrastructure · Duopoly RTA & Certified KRA',
    call: 'BUY',
    callSubtext: 'Core Institutional Compounder · Accumulate',
    weightAllocation: '60%',
    latestPrice: '₹796.60',
    priceContext: 'Premium Compounder Band',
    forwardPe: '~38.6x',
    ebitdaMargin: '~46.3%',
    netMargin: '~32.2%',
    debtStatus: 'Zero Debt (Net Cash)',
    dividendYield: '~1.45%',
    roce: '44.8%',
    moatClassification: 'Commercial & Operational Switching-Friction Moat',
    moatVulnerabilityRating: 'Low-to-Moderate (Negotiated B2B TER Pass-Through)',
    regulatoryRegime: 'SEBI (Mutual Fund TER & KRA Norms) · MeitY (DPDP Act)',
    whoPays: 'Asset Management Companies (AMCs), AIF/PMS funds, and KYC-regulated financial institutions',
    revenueClippingModel:
      'Slab-based regressive AUM percentage fee (typically 0.02%–0.05% / 2–5 bps on ~68% of Indian MF AUM; equity > debt) plus KRA KYC data-pull fees',
    adjacencyEngines:
      'CAMS KRA (domestic & global non-resident KYC verification), CAMSfinserv (AA), AIF/PMS RTA, CAMSPay & CAMSRep',
    fixedCostArchitecture:
      'Unified registrar ledger, SIP clearing rails, and KRA verification APIs amortize fixed technology costs across ~68% of Indian MF assets, sustaining ~46.3% EBITDA margins',
    editorialImage: '/src/assets/images/cams_financial_clearing_1793332851878.jpg',
    imageCaption:
      'Fig. 1 — CAMS clips 0.02%–0.05% regressive basis-point slabs on mutual fund AUM while scaling DPDP-ready KRA verification.',
    section1Mechanics:
      'Unlike flat per-trade exchanges, CAMS monetizes Asset Management Companies (AMCs) through an asset-light percentage fee on daily average Assets Under Management (~68% industry share), typically ranging from 0.02% to 0.05% (2 to 5 basis points) with equity schemes commanding roughly 2.5x–3x the yield of liquid/debt funds. Crucially, this pricing architecture is slab-based and regressive: as a marquee equity fund’s AUM scales massive, the marginal bps rate CAMS clips steps down slightly, yet the sheer compounding velocity of retail Systematic Investment Plans (SIPs, >63% live share) easily outpaces slab regression. Layering this MF core (~85.6% of revenue), CAMS scales high-margin B2B data rails (~14.4% of revenue): CAMS KRA (charging per KYC verification pull), Account Aggregator consent switches (CAMSfinserv), AIF/PMS servicing, and CAMSPay mandate clearing.',
    section2MoatStressTest:
      'SEBI is structurally committed to lowering retail investing costs by periodically rationalizing and capping Mutual Fund Total Expense Ratios (TER). Whenever SEBI squeezes AMC fee pools, fund houses immediately attempt to pass on pressure by renegotiating RTA basis-point slabs with CAMS. Yet stress-testing reveals exceptional durability: migrating away from CAMS to its sole rival (KFintech) requires porting decades of sensitive legacy investor folios, distributor trail ledgers, and live SIP mandates with zero tolerance for operational downtime. Because CAMS’ software is deeply woven into the back-offices of India’s largest AMCs, switching friction is astronomically high—allowing CAMS to contain renewal yield resets to ~2–4% annually while 16–18% structural equity AUM compounding drives net earnings higher.',
    section3DriversVsDrags:
      'Over the upcoming 12-to-24-month enforcement phase of India’s Digital Personal Data Protection (DPDP) Act, financial entities face stringent Significant Data Fiduciary (SDF) mandates—verifiable consent artifacts, encrypted localization, independent data audits, and breach penalties up to ₹250 crore. While compliance adds ~100–150 bps to CAMS’ tech/security OPEX within its 10–11% cost-growth envelope, smaller wealth firms, fintechs, and AIFs cannot afford to engineer independent security stacks. CAMS has turned this regulatory burden into an offensive B2B moat—operating as a certified data clearinghouse via CAMSfinserv and expanding CAMS KRA to verify global non-resident investor (NRI/FPI) portfolios.',
    section4ValuationDisconnect:
      'At ~38.6x forward earnings, CAMS commands a substantial valuation premium over IRCTC (~31.0x) and more than double IEX (~17.3x). Institutional managers pay a compounder multiple for three structural advantages: (1) commercial B2B pricing sovereignty free from overnight government tariff circulars or order-book pooling, (2) direct gearing to household financialization via sticky monthly SIPs, and (3) ~44.8% ROCE with net-cash dividend conversion.',
    section5AllocationThesis:
      'Rank #1 — BUY (60% Sleeve Allocation). CAMS represents the highest-conviction secular compounder among Indian market intermediaries over a 12-to-24-month horizon. Accumulate systematically, treating transient SEBI TER consultation headlines as institutional entry windows.',
    validatesThesis: [
      'Monthly SIP inflows sustain secular momentum with CAMS holding >63% live SIP share, outpacing regressive AUM slab tiering',
      'Bilateral AMC contract renewals contain realized RTA bps yield compression below 3% per annum while EBITDA margin holds ~45–46%',
      'DPDP-driven outsourcing accelerates CAMS KRA (including non-resident investor KYC) and non-MF revenue mix toward 18–20%',
    ],
    breaksThesis: [
      'Aggressive SEBI TER cuts trigger coordinated top-5 AMC fee renegotiations reducing realized RTA bps yields by >6–8% (~13–17% static EBITDA hit)',
      'Sustained domestic equity bear market erodes mark-to-market equity AUM by >20%, reversing fixed-cost operating leverage',
      'Material DPDP Act data-fiduciary breach penalty or compliance cost blowout compressing EBITDA margins below 42%',
    ],
    keyMonitorables: [
      'Quarterly equity AUM mix vs. regressive slab realization post-SEBI TER circulars',
      'CAMS KRA domestic & global non-resident KYC verification revenue growth',
      'DPDP Act Significant Data Fiduciary audit & compliance cost trajectory',
    ],
  },
  {
    rank: 2,
    ticker: 'IRCTC',
    name: 'Indian Railway Catering and Tourism Corp.',
    sectorTag: 'Sovereign PSU Bottleneck · Rail Ticketing, Catering & Rail Neer',
    call: 'HOLD',
    callSubtext: 'Sovereign Volume Play · Equal-Weight / Selective Hold',
    weightAllocation: '30%',
    latestPrice: '₹517.75',
    priceContext: 'PSU Governance Valuation Cap',
    forwardPe: '~31.0x',
    ebitdaMargin: '~28.2%–33.5%',
    netMargin: '~24.1%',
    debtStatus: 'Zero Debt (Net Cash PSU)',
    dividendYield: '~1.65%',
    roce: '39.4%',
    moatClassification: 'Statutory / Sovereign Monopoly Moat',
    moatVulnerabilityRating: 'Moderate-to-High (Parent Ministry Policy & Fee-Split Risk)',
    regulatoryRegime: 'Ministry of Railways / Railway Board · DIPAM (OFS)',
    whoPays: 'Indian rail passengers (convenience fees, meals, water, tours) & third-party catering licensees',
    revenueClippingModel:
      '430M+ annual e-tickets clipping fixed ₹15 (Non-AC) / ₹30 (AC) via net-banking/UPI (~100% gross margin), ~1.5M L/day Rail Neer water plants, and hefty vendor catering license shares',
    adjacencyEngines:
      'Sealed-window 24-coach Vande Bharat Sleeper & Amrit Bharat digital catering, e-Catering app take-rates & Bharat Gaurav rail circuits',
    fixedCostArchitecture:
      'Sunk ticketing reservation software yields >80% segment EBIT margin, diluted at group level (~28–34% EBITDA) by physical catering procurement, Rail Neer bottling, and tourism pass-through costs',
    editorialImage: '/src/assets/images/irctc_express_rail_1793332853369.jpg',
    imageCaption:
      'Fig. 2 — IRCTC pairs 430M+ near-100%-gross-margin e-tickets with Vande Bharat Sleeper catering and ~1.5M L/day Rail Neer plants.',
    section1Mechanics:
      'IRCTC processes over 430 million e-tickets annually as the sole statutory online ticketing gateway for Indian Railways, clipping a fixed ₹15 per ticket for Non-AC classes and ₹30 for AC classes ( ₹10 / ₹20 on UPI/BHIM rails). Because core reservation servers are sunk fixed assets, incremental convenience-fee revenue carries virtually 100% gross margin and >80% segment EBIT margin. IRCTC layers this software tollbooth with dedicated Rail Neer packaged-water plants producing ~1.5 million liters per day at regulated fixed margins, Bharat Gaurav rail tourism, and a lucrative catering franchise where third-party food vendors pay IRCTC substantial license fees and revenue-share percentages—alongside direct onboard Vande Bharat/Rajdhani catering—resulting in a blended ~28.2%–33.5% consolidated EBITDA margin.',
    section2MoatStressTest:
      'As a state-owned PSU (~62.4% Government-owned), IRCTC’s existential vulnerability is not private competition—OTAs like MakeMyTrip and ixigo must route bookings through IRCTC’s APIs—but policy intervention by its own parent, the Ministry of Railways. Late 2021 remains the definitive institutional stress test: the Ministry abruptly ordered IRCTC to share 50% of its high-margin ticket convenience fees with the government, crashing the stock 25% in a single morning. Although withdrawn within 24 hours amid intense public market backlash, that sovereign overhang remains permanent: whenever citizen affordability takes precedence over minority-shareholder ROE, the government can cap catering margins (e.g., ₹0.40/pax-km administered sleeper tariffs), reclaim payment-gateway fees, or issue discounted DIPAM OFS tranches.',
    section3DriversVsDrags:
      'Across the 12-to-24-month horizon, Indian Railways’ structural transition of premium long-distance transit to 24-coach Vande Bharat Sleeper trainsets (equipped with dedicated modernized AC pantry cars) and the Amrit Bharat network acts as a powerful catering multiplier. Unlike legacy open-window coaches where passengers relied on home-cooked meals or unorganized platform hawkers, the high-speed, sealed-window architecture and shorter station halts of Vande Bharat rakes structurally funnel passengers into IRCTC’s centralized, pre-ordered onboard and digital e-Catering ecosystem. The offsetting drag is mix math: rapid expansion in physical catering and tourism grows top-line revenue faster than EBITDA unless high-margin e-Catering vendor commissions scale faster than pass-through meal costs.',
    section4ValuationDisconnect:
      'IRCTC trades around ~31.0x earnings—roughly a 20% multiple discount to CAMS despite enjoying 100% statutory online ticketing exclusivity over the world’s fourth-largest rail network. Markets enforce this "PSU Discount" because convenience fees are politically frozen rather than inflation-indexed, and sovereign ownership caps terminal multiple expansion.',
    section5AllocationThesis:
      'Rank #2 — HOLD (30% Sleeve Allocation). Maintain measured portfolio exposure to capture volume compounding from 24-coach Vande Bharat Sleeper inductions and cash-generative e-ticketing, while sizing defensively against unannounced Ministry of Railways policy pivots.',
    validatesThesis: [
      'Accelerated deployment of sealed-window 24-coach Vande Bharat Sleeper & Amrit Bharat rakes drives >16–18% catering/ticketing revenue growth with group EBITDA margin stabilizing >32%',
      'Ministry of Railways preserves 100% IRCTC retention of ₹15/₹30 convenience fees without revenue-sharing mandates',
      'Asset-light e-Catering vendor revenue shares and ~1.5M L/day+ Rail Neer capacity expansion lift non-ticketing ROCE',
    ],
    breaksThesis: [
      'Revival of a late-2021-style Ministry directive splitting convenience-fee revenue or waiving digital ticketing fees',
      'Railway Board catering tariff caps collide with food inflation, compressing consolidated EBITDA margin below 27–28%',
      'Recurring DIPAM Offer-for-Sale (OFS) stake dilutions creating persistent institutional supply overhang',
    ],
    keyMonitorables: [
      '24-coach Vande Bharat Sleeper & AC pantry car commercial induction schedule and catering margin conversion',
      'Ministry of Railways commercial circulars on ₹15/₹30 convenience fees and onboard meal tariffs',
      'High-margin e-Catering license share vs. pass-through physical catering revenue mix',
    ],
  },
  {
    rank: 3,
    ticker: 'IEX',
    name: 'Indian Energy Exchange Ltd.',
    sectorTag: 'Power Market Exchange · Endangered Liquidity Monopoly',
    call: 'SELL / AVOID',
    callSubtext: 'Avoid Fresh Core Capital · Regulatory De-Rating Risk',
    weightAllocation: '10%',
    latestPrice: '₹105.25',
    priceContext: 'Trading Near 52-Week Lows',
    forwardPe: '~17.3x',
    ebitdaMargin: '~83.5%',
    netMargin: '~66.0%',
    debtStatus: 'Zero Debt (Treasury Cash Buffer)',
    dividendYield: '~3.45%',
    roce: '41.2%',
    moatClassification: 'Two-Sided Order-Book Liquidity & Network-Effect Moat',
    moatVulnerabilityRating: 'Severe / Structural (CERC Market Coupling via Grid India)',
    regulatoryRegime: 'CERC & Grid India (Power Market Coupling) · PNGRB (IGX)',
    whoPays: 'Power generators & state discoms / open-access buyers (flat 2 paise/unit each side)',
    revenueClippingModel:
      'Volume-based double-sided toll: flat 2 paise (₹0.02)/kWh from buyer + 2 paise/kWh from seller across 96 daily blind-auction blocks—decoupled from power prices',
    adjacencyEngines:
      'Real-Time Market (RTM 30-min dispatch window), Green Term-Ahead (G-TAM/G-DAM), coupling-exempt Indian Gas Exchange (IGX ~47.3%) & Carbon Credits (ICX)',
    fixedCostArchitecture:
      'Pure matching & clearing software clears ~40 BU/quarter at near-zero marginal cost, producing ~83.5% EBITDA margin and ~66% normalized Net Profit Margin',
    editorialImage: '/src/assets/images/iex_power_grid_1793332854186.jpg',
    imageCaption:
      'Fig. 3 — Grid India market coupling aggregates IEX, PXIL, and HPX bids into one national clearing price, socializing liquidity.',
    section1Mechanics:
      'IEX monetizes pure electricity volume rather than asset values or power tariffs. For every kilowatt-hour (or MWh) matched across its 96 daily 15-minute double-sided blind auctions, IEX clips a flat 2 paise (₹0.02) transaction charge from the buyer AND 2 paise from the seller (~4.0–4.2 paise/kWh blended). Revenue is completely decoupled from whether spot electricity clears at ₹2.50/unit or ₹8.00/unit—it tracks physical power throughput alone. Because the matching engine and settlement software are sunk fixed costs, incremental volume converts at >85% operating margin, yielding ~83.5% EBITDA margins, a ~66% structural Net Profit Margin (higher including treasury income), zero debt, and a ~3.45% dividend yield.',
    section2MoatStressTest:
      'CERC’s implementation of Market Coupling via Grid India represents the most active regulatory moat deconstruction in corporate India. Under the legacy architecture, IEX held an 85%+ liquidity pool where buyers and sellers congregated on IEX’s proprietary matching algorithm to discover the Market Clearing Price (MCP), starving rivals PXIL and HPX of depth. Under Future Market Coupling, IEX, PXIL, and HPX bids are routed upstream into Grid India’s central government aggregated algorithm to compute one Single National Clearing Price. IEX is reduced to a standardized bid-collection post; its liquidity advantage is instantly socialized across PXIL and HPX, inviting aggressive transaction-fee discounting.',
    section3DriversVsDrags:
      'To survive DAM coupling, IEX is aggressively pivoting volume into complex segments resistant to immediate central coupling: (1) the Real-Time Market (RTM, ~42% of volume), where renewable grid imbalances must be matched, cleared, and dispatched within a tight 30-minute operational window; (2) Green Term-Ahead and Green Day-Ahead Markets (G-TAM / G-DAM); and (3) natural gas trading via its ~47.28% stake in the Indian Gas Exchange (IGX)—regulated by PNGRB and completely exempt from CERC electricity market coupling—alongside carbon credits (ICX). However, CERC has already flagged post-DAM coupling feasibility for RTM, and associate income from IGX (subject to a 25% promoter cap via IPO OFS) cannot offset a structural cut in IEX’s 2-paise electricity fee over the next 12–24 months.',
    section4ValuationDisconnect:
      'Trading near 52-week lows at ~17.3x P/E despite a ~66% Net Profit Margin, zero debt, and a ~3.45% dividend yield, IEX exemplifies the institutional "Margin-of-Safety Paradox." A 66% net margin is the historical symptom of an unchallenged liquidity monopoly, not a floor under earnings. Because technology costs are fixed, operating leverage cuts violently in reverse: if PXIL/HPX undercut fees post-coupling and force IEX from 4.0p toward 2.6–2.8p blended, pre-tax operating profit drops >30% while terminal multiples compress toward 12–13x regulated utility territory (~₹67 Bear value), leaving risk-reward negatively skewed despite optical cheapness.',
    section5AllocationThesis:
      'Rank #3 — SELL / AVOID for fresh institutional capital (0% core weight; max 10% tactical cap for turnaround/yield sleeves). Monitor CERC implementation timelines closely to verify dividend safety; commit capital only if coupling is judicially stayed or post-coupling take-rates prove resilient.',
    validatesThesis: [
      'CERC enforces live Grid India DAM coupling and outlines phase-2 coupling extension into the 30-minute Real-Time Market (RTM)',
      'PXIL or HPX introduce aggressive transaction-fee rebates (<1.5 paise/side) to capture discom bids, forcing IEX to cut its 2-paise fee',
      'Market compresses IEX’s P/E multiple toward 12–14x utility/brokerage territory as network moat alpha disappears',
    ],
    breaksThesis: [
      'APTEL judicial stay or CERC policy revision preserving decentralized exchange-level price discovery (Upgrades IEX to BUY)',
      'Empirical post-coupling data confirms >80% market share retention at IEX with zero fee erosion below 4.0 paise/kWh blended',
      'Sustained >20% CAGR in 30-minute RTM, G-TAM, and coupling-exempt IGX natural gas earnings outpacing DAM fee pressure',
    ],
    keyMonitorables: [
      'CERC Market Coupling go-live timeline, Grid India shadow-pilot orders & dividend payout coverage',
      'Post-coupling buyer/seller transaction fee schedules (2p/unit baseline vs. PXIL/HPX discounts)',
      '30-minute RTM volume share (~42%) + coupling-exempt IGX gas volume & IPO valuation unlock',
    ],
  },
];

export const COUPLING_ARCHITECTURE_ROWS: CouplingStepRow[] = [
  {
    step: '01. Bid Intake & Gateway',
    standaloneIex: 'Participants connect to IEX’s siloed 85%+ liquidity pool; rivals PXIL/HPX lack counterparty depth',
    coupledGridIndia: 'IEX, PXIL, and HPX operate as front-end bid-collection posts forwarding bids to Grid India',
    moatImpact: 'Reduces IEX to a bid-collection terminal; switching friction drops to UI & margin convenience',
  },
  {
    step: '02. Matching Algorithm',
    standaloneIex: 'IEX’s proprietary blind-auction algorithm clears supply/demand curves across 96 daily blocks',
    coupledGridIndia: 'Grid India (Central Government MCO) runs one aggregated matching algorithm over all national bids',
    moatImpact: 'Deconstructs IEX’s proprietary algorithmic price-discovery monopoly',
  },
  {
    step: '03. Market Clearing Price (MCP)',
    standaloneIex: 'Exchange-specific MCP; thin order books on PXIL/HPX suffer slippage and wider spreads',
    coupledGridIndia: 'Single National Clearing Price across IEX, PXIL, and HPX simultaneously',
    moatImpact: 'Eliminates execution-price penalty for routing discom/generator bids through PXIL or HPX',
  },
  {
    step: '04. Liquidity Network Effect',
    standaloneIex: 'Self-reinforcing two-sided liquidity moat keeps 85–90%+ short-term power volume on IEX',
    coupledGridIndia: 'Order-book depth is pooled nationally—HPX buyer seamlessly matches against IEX seller',
    moatImpact: 'Instantly socializes IEX’s liquidity advantage across smaller rival exchanges',
  },
  {
    step: '05. Fee & Margin Economics',
    standaloneIex: 'IEX clips flat 2 paise/unit buyer + 2 paise/unit seller (~66% Net Margin) unchallenged',
    coupledGridIndia: 'Commoditized exchanges compete for bid intake via transaction-fee rebates and clearing terms',
    moatImpact: 'Triggers reverse operating leverage on IEX’s fixed-cost P&L if fees compress',
  },
];

export const IEX_PIVOT_SEGMENTS: IexPivotSegment[] = [
  {
    segment: 'Real-Time Market (RTM — Tight 30-Min Window)',
    shareOfVolume: 42,
    growthTrajectory: '+12% to +18% YoY grid renewable balancing',
    couplingShieldStatus: 'Uncoupled in Phase 1 (complex 30-min dispatch); Phase-2 CERC watch',
    strategicRead: 'Primary near-term volume shield leveraging tight 30-minute matching & dispatch execution',
  },
  {
    segment: 'Day-Ahead Market (DAM — 24h Spot Auction)',
    shareOfVolume: 37,
    growthTrajectory: '+2% to +6% YoY mature base',
    couplingShieldStatus: 'Immediate Phase 1 Grid India coupling target',
    strategicRead: 'Directly exposed to national order-book socialization and PXIL/HPX fee undercutting',
  },
  {
    segment: 'Term-Ahead & Contingency (TAM / LDC)',
    shareOfVolume: 14,
    growthTrajectory: 'Cyclical bilateral & seasonal spikes',
    couplingShieldStatus: 'Bilateral/contingency contracts up to 11 weeks',
    strategicRead: 'Partial insulation via customized delivery profiles, facing DEEP e-bidding competition',
  },
  {
    segment: 'Green Markets (G-TAM) + IGX Gas & Carbon',
    shareOfVolume: 7,
    growthTrajectory: 'IGX gas & ICX carbon scaling from low base',
    couplingShieldStatus: 'IGX (PNGRB-regulated) is 100% exempt from power coupling',
    strategicRead: 'True regulatory diversification via IGX (~47.3% stake, OFS to 25%), but <10% near-term EPS weight',
  },
];

export const INITIAL_DISPATCHES: RegulatoryDispatch[] = [
  {
    id: 'disp-cerc-coupling-grid',
    headline: 'CERC Market Coupling via Grid India Socializes IEX’s 85%+ Order Book Into a Single National Clearing Price',
    date: 'Oct 2026',
    regulator: 'CERC & Grid India',
    tickers: ['IEX'],
    category: 'Market Structure Mandate',
    verificationStatus: 'Primary Regulatory Framework',
    summary:
      'CERC’s Market Coupling architecture routes buy and sell bids from IEX, PXIL, and HPX into Grid India’s centralized matching algorithm—turning standalone exchanges into front-end bid-collection posts.',
    transmissionMechanism:
      'Neutralizes IEX’s two-sided liquidity moat and exposes its flat 2 paise/unit buyer + 2 paise/unit seller fee (~66% Net Margin) to rival fee discounting.',
    quantitativeTakeaway: '2p + 2p/kWh fee · 85%+ liquidity socialized · ~66% NPM at risk',
    sources: [
      { title: 'CERC Power Market Coupling Orders & Grid India Pilot Filings' },
    ],
  },
  {
    id: 'disp-sebi-ter-cams',
    headline: 'SEBI TER Caps vs. CAMS Switching Friction: Why AMCs Rarely Migrate Legacy Folios to KFintech',
    date: 'FY27 Ongoing',
    regulator: 'SEBI',
    tickers: ['CAMS'],
    category: 'TER & Fee Regulation',
    verificationStatus: 'Notified Regulation',
    summary:
      'Periodic SEBI reductions in Mutual Fund Total Expense Ratios (TER) prompt AMCs to renegotiate CAMS’ regressive 0.02%–0.05% AUM slabs, yet zero-downtime migration risks across decades of investor data prevent client defections to KFintech.',
    transmissionMechanism:
      'Contains annual B2B yield resets to ~2–4%, enabling surging retail SIP volumes (>63% share) to sustain ~46.3% EBITDA margins.',
    quantitativeTakeaway: '0.02%–0.05% AUM slabs · ~68% MF AUM share · ~46.3% EBITDA',
    sources: [
      { title: 'SEBI Mutual Funds TER & Brokerage Unbundling Circulars' },
      { title: 'CAMS Institutional Investor Disclosures' },
    ],
  },
  {
    id: 'disp-irctc-vb-sleeper',
    headline: 'Sealed-Window 24-Coach Vande Bharat Sleeper & Amrit Bharat Fleet Multiplier Lifts IRCTC Digital Catering',
    date: 'FY27–FY28',
    regulator: 'Ministry of Railways',
    tickers: ['IRCTC'],
    category: 'Fleet & Infrastructure Catalyst',
    verificationStatus: 'Operational Rollout',
    summary:
      'Indian Railways’ transition to high-speed, sealed-window 24-coach Vande Bharat Sleeper (with dedicated AC pantry cars) and Amrit Bharat trainsets eliminates unorganized platform hawking and channels passengers into IRCTC’s pre-ordered catering ecosystem.',
    transmissionMechanism:
      'Compounds catering license shares alongside 430M+ e-tickets (₹15 Non-AC / ₹30 AC) and ~1.5M L/day Rail Neer output, subject to administered meal tariff caps.',
    quantitativeTakeaway: '430M+ e-tickets · ₹15/₹30 fee · ~1.5M L/day Rail Neer',
    sources: [
      { title: 'Ministry of Railways Rolling Stock & Vande Bharat Catering Circulars' },
    ],
  },
  {
    id: 'disp-meity-dpdp-cams',
    headline: 'DPDP Act Enforcement Turns Compliance Into a CAMS B2B Data-Clearinghouse & Global Non-Resident KRA Stream',
    date: 'May 2027 Window',
    regulator: 'MeitY (DPDP)',
    tickers: ['CAMS', 'IRCTC'],
    category: 'Data Protection Mandate',
    verificationStatus: 'Notified Rules',
    summary:
      'Strict data-fiduciary obligations under the Digital Personal Data Protection (DPDP) Act price smaller financial firms out of building standalone security stacks, driving outsourcing to CAMS’ certified data clearinghouse and KRA verification rails for domestic and global non-resident portfolios.',
    transmissionMechanism:
      'Converts ~100–150 bps compliance OPEX into high-margin B2B KRA and Account Aggregator market-share gains.',
    quantitativeTakeaway: '₹250 cr breach penalty cap · Non-MF revenue ~14.4% → 20% target',
    sources: [
      { title: 'MeitY Digital Personal Data Protection Rules & SEBI KRA Circulars' },
    ],
  },
  {
    id: 'disp-irctc-psu-fee-risk',
    headline: 'IRCTC Sovereign Stress-Test Benchmark: Lessons From the Late-2021 50% Convenience-Fee Split Order',
    date: 'Governance Benchmark',
    regulator: 'Ministry of Railways',
    tickers: ['IRCTC'],
    category: 'Sovereign Governance Risk',
    verificationStatus: 'Historical Stress Precedent',
    summary:
      'Remembering late 2021—when an abrupt Ministry order demanding 50% of IRCTC’s convenience fees triggered a 25% single-morning stock crash before reversal within 24 hours—institutional desks maintain a permanent governance discount (~31x vs CAMS ~38.6x).',
    transmissionMechanism:
      'Because ₹15/₹30 convenience fees carry ~100% gross margin, any future sovereign fee-share or catering margin cap flows directly to PAT.',
    quantitativeTakeaway: 'Late-2021 50% split precedent (-25% 1-day shock) · ~31.0x P/E',
    sources: [
      { title: 'IRCTC NSE Exchange Filings & DIPAM Disinvestment Tracker' },
    ],
  },
  {
    id: 'disp-iex-rtm-igx-carbon',
    headline: 'IEX Defensive Pivot: 30-Minute Real-Time Market (~42% Share) & Coupling-Exempt IGX Natural Gas',
    date: 'Q2 FY27',
    regulator: 'PNGRB & Carbon',
    tickers: ['IEX'],
    category: 'Strategic Diversification',
    verificationStatus: 'Verified Exchange Print',
    summary:
      'IEX is defending volume via the tight 30-minute dispatch Real-Time Market (RTM, ~42% share), Green Term-Ahead contracts, and associate Indian Gas Exchange (IGX, ~47.28% stake), which is governed by PNGRB and completely exempt from electricity market coupling.',
    transmissionMechanism:
      'Buffers near-term volume and unlocks cash via IGX’s planned OFS to 25%, though core valuation hinges on post-coupling electricity take-rates.',
    quantitativeTakeaway: '30-min RTM ~42% mix · IGX power-coupling exempt · 3.45% yield',
    sources: [
      { title: 'IEX Power Volume Filings & IGX DRHP Disclosures' },
    ],
  },
];

export const THESIS_TRIGGER_MATRIX: ThesisTriggerItem[] = [
  {
    id: 'trig-cams-ter',
    ticker: 'CAMS',
    recommendation: 'BUY',
    domain: 'SEBI TER Caps & Regressive AUM Slabs',
    triggerParameter: '0.02%–0.05% Bps Realization vs. SIP Volume Velocity',
    validationCondition: 'SIP inflows (>63% share) and >15% equity AUM growth outpace regressive slab tiering; AMC renewals cap bps compression <3%/yr.',
    breakerCondition: 'Severe SEBI TER cut triggers >6–8% RTA fee renegotiations or >20% equity market drawdown.',
    horizonWindow: '6–18 Months',
  },
  {
    id: 'trig-cams-kra-dpdp',
    ticker: 'CAMS',
    recommendation: 'BUY',
    domain: 'DPDP Clearinghouse & Global KRA',
    triggerParameter: 'B2B Fiduciary Onboarding & Non-Resident KYC',
    validationCondition: 'Smaller financial firms outsource DPDP compliance and global non-resident KRA verification to CAMS, lifting non-MF share toward 18–20%.',
    breakerCondition: 'Material DPDP data-fiduciary breach penalty or compliance spend eroding EBITDA margin below 42%.',
    horizonWindow: '12–24 Months',
  },
  {
    id: 'trig-irctc-vb24',
    ticker: 'IRCTC',
    recommendation: 'HOLD',
    domain: 'Sealed-Window Vande Bharat Sleeper & Amrit Bharat',
    triggerParameter: '24-Coach AC Pantry & Pre-Ordered Digital Catering',
    validationCondition: 'Sealed-window high-speed transit shifts passengers from platform stalls to IRCTC digital pre-ordered catering, holding group EBITDA >32%.',
    breakerCondition: 'Rake rollout delays or food input inflation against capped tariffs dragging group EBITDA below 28%.',
    horizonWindow: '6–18 Months',
  },
  {
    id: 'trig-irctc-sovereign',
    ticker: 'IRCTC',
    recommendation: 'HOLD',
    domain: 'Ministry Policy & Convenience-Fee Risk',
    triggerParameter: '₹15 Non-AC / ₹30 AC Fee Retention (430M+ Tickets)',
    validationCondition: 'Ministry of Railways maintains 100% convenience-fee retention at IRCTC with zero catering margin Rollbacks.',
    breakerCondition: 'Repeat of late-2021 policy shock mandating convenience-fee sharing or payment-gateway fee caps.',
    horizonWindow: '0–24 Months (Continuous)',
  },
  {
    id: 'trig-iex-coupling',
    ticker: 'IEX',
    recommendation: 'SELL / AVOID',
    domain: 'CERC & Grid India Market Coupling',
    triggerParameter: '2p + 2p/kWh Double-Sided Fee & Dividend Coverage',
    validationCondition: '(Validates Sell/Avoid): Grid India pools IEX/PXIL/HPX bids into one national MCP and rival rebates compress IEX take-rate below 3.2p/kWh.',
    breakerCondition: '(Upgrades IEX): Judicial stay/reversal of coupling OR >80% share retained at ~4.0p/kWh post-coupling.',
    horizonWindow: '6–18 Months',
  },
  {
    id: 'trig-iex-pivot',
    ticker: 'IEX',
    recommendation: 'SELL / AVOID',
    domain: '30-Min RTM & Coupling-Exempt IGX',
    triggerParameter: 'Uncoupled Derivatives & Natural Gas Exchange Growth',
    validationCondition: '(Validates Sell/Avoid): CERC extends coupling blueprint to 30-minute RTM while IGX/carbon remain <10% of PAT.',
    breakerCondition: '(Upgrades IEX): 30-min RTM remains permanently uncoupled at >20% CAGR alongside high-multiple IGX IPO.',
    horizonWindow: '12–24 Months',
  },
];

export const SAMPLE_POLICY_SCENARIOS = [
  {
    label: 'Stress-Test: Grid India DAM Coupling + PXIL Slashes 2p Fee by 35%',
    text: 'Evaluate the 12-to-24 month earnings, dividend safety, and P/E impact on IEX (flat 2 paise buyer + 2 paise seller fee, ~66% net profit margin, zero debt, ~3.45% yield near 52-week lows) if Grid India pools IEX, PXIL, and HPX bids into a single national clearing price and rivals cut fees by 35%.',
  },
  {
    label: 'Stress-Test: SEBI Cuts MF TER Caps vs. CAMS KFintech Switching Friction',
    text: 'Evaluate how CAMS’ regressive 0.02%–0.05% AUM slab pricing, KFintech switching friction, and DPDP-driven non-resident KRA verification respond over 12–24 months if SEBI cuts mutual fund TER slabs by 10 bps.',
  },
  {
    label: 'Stress-Test: IRCTC Sealed-Window Vande Bharat Catering vs. 2021-Style Fee Split',
    text: 'Contrast the 12-month catering revenue multiplier from sealed-window 24-coach Vande Bharat Sleeper and Amrit Bharat trains against a late-2021-style Ministry of Railways order reclaiming 50% of IRCTC’s ₹15/₹30 convenience fees across 430M+ e-tickets.',
  },
];

export const SOURCE_BIBLIOGRAPHY = {
  regulatoryFrameworks: [
    'SEBI Mutual Funds Regulations (TER Rationalization) & KRA KYC Master Circulars (Domestic & Global Non-Resident Portfolios)',
    'CERC Power Market Regulations & Market Coupling Orders designating Grid India (Centralized MCP Aggregation)',
    'Ministry of Railways / Railway Board Circulars on Convenience Fees (₹15 Non-AC / ₹30 AC), Rail Neer & Vande Bharat Sleeper Catering',
    'MeitY Digital Personal Data Protection (DPDP) Act, 2023 & Significant Data Fiduciary (SDF) Compliance Rules',
    'PNGRB Natural Gas Exchange Regulations (IGX Coupling-Exempt Framework) & BEE Carbon Credit Trading Scheme (CCTS)',
  ],
  companyDisclosures: [
    'CAMS Investor Filings (~68% MF AUM serviced, 0.02%–0.05% tiered slabs, >63% live SIP share, CAMS KRA & CAMSfinserv)',
    'IRCTC Annual & Quarterly Filings (430M+ e-tickets, ~1.5M liters/day Rail Neer capacity, Vande Bharat & Amrit Bharat catering)',
    'IEX Power Volume & Financial Disclosures (96-block 2p+2p/kWh clearing, 30-min RTM ~42% share, ~66% core NPM, IGX DRHP)',
  ],
};
