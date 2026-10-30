import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface ValuationLabViewProps {
  initialTab?: 'iex' | 'cams' | 'irctc';
}

export function ValuationLabView({ initialTab = 'iex' }: ValuationLabViewProps) {
  const [activeModel, setActiveModel] = useState<'iex' | 'cams' | 'irctc'>(initialTab);

  // --- MODULE 1: IEX Margin-of-Safety Paradox (~66% NPM, Zero Debt, ~3.45% Yield) ---
  const [iexSpotPrice, setIexSpotPrice] = useState<number>(105.25);
  const [iexCoreRevCr, setIexCoreRevCr] = useState<number>(815); // Annualised operating + treasury baseline
  const [iexNetMarginPct, setIexNetMarginPct] = useState<number>(66.0); // ~66% Net Profit Margin mandate input
  const [iexDividendPayoutPct, setIexDividendPayoutPct] = useState<number>(60); // ~3.45% yield at spot
  const [iexSharesCr] = useState<number>(89);

  const [bearProb, setBearProb] = useState<number>(35);
  const [bearTakeCut, setBearTakeCut] = useState<number>(-30);
  const [bearVolGrowth, setBearVolGrowth] = useState<number>(10);
  const [bearExitPe, setBearExitPe] = useState<number>(13);

  const [baseProb, setBaseProb] = useState<number>(45);
  const [baseTakeCut, setBaseTakeCut] = useState<number>(-15);
  const [baseVolGrowth, setBaseVolGrowth] = useState<number>(12);
  const [baseExitPe, setBaseExitPe] = useState<number>(15);

  const [bullProb, setBullProb] = useState<number>(20);
  const [bullTakeCut, setBullTakeCut] = useState<number>(0);
  const [bullVolGrowth, setBullVolGrowth] = useState<number>(15);
  const [bullExitPe, setBullExitPe] = useState<number>(20);

  const [igxCarbonValueCr, setIgxCarbonValueCr] = useState<number>(980); // IGX (~47.3% stake) + ICX Carbon option

  // --- MODULE 2: CAMS SEBI TER Rationalization, KRA & DPDP Act Lab ---
  const [camsYieldCut, setCamsYieldCut] = useState<number>(3.0);
  const [camsAumGrowth, setCamsAumGrowth] = useState<number>(16.5);
  const [camsKraNonMfGrowth, setCamsKraNonMfGrowth] = useState<number>(24.0);
  const [camsDpdpOverheadBps, setCamsDpdpOverheadBps] = useState<number>(120); // 120 bps = 1.2% of revenue

  // --- MODULE 3: IRCTC 24-Coach Vande Bharat Sleeper, AC Pantry & PSU Fee-Split Lab ---
  const [irctcVb24Rakes, setIrctcVb24Rakes] = useState<number>(15);
  const [irctcCateringMarginPct, setIrctcCateringMarginPct] = useState<number>(11.5);
  const [irctcRailwaysFeeCutPct, setIrctcRailwaysFeeCutPct] = useState<number>(0); // 0% = status quo; 50% = 2021-style split shock
  const [irctcTicketingGrowth, setIrctcTicketingGrowth] = useState<number>(12.0);

  // --- IEX Computations ---
  const iexBasePatCr = iexCoreRevCr * (iexNetMarginPct / 100); // ~₹538 cr at 66% of 815
  const iexTrailingEps = iexBasePatCr / iexSharesCr;
  const iexImpliedYieldPct = ((iexTrailingEps * (iexDividendPayoutPct / 100)) / iexSpotPrice) * 100;

  const totalProb = bearProb + baseProb + bullProb;
  const wBear = totalProb > 0 ? bearProb / totalProb : 0.35;
  const wBase = totalProb > 0 ? baseProb / totalProb : 0.45;
  const wBull = totalProb > 0 ? bullProb / totalProb : 0.2;

  // Fixed-cost exchange reverse operating leverage: fee cuts drop heavily to PAT
  const calcCoupledPat24M = (feeDeltaPct: number, volCagrPct: number) => {
    const volFactor = Math.pow(1 + volCagrPct / 100, 2);
    const grossRev2Y = iexCoreRevCr * volFactor * (1 + feeDeltaPct / 100);
    const fixedCosts2Y = iexCoreRevCr * (1 - iexNetMarginPct / 100) * 1.16; // ~8% annual tech/staff inflation
    return Math.max(120, grossRev2Y - fixedCosts2Y);
  };

  const bearPat2Y = calcCoupledPat24M(bearTakeCut, bearVolGrowth);
  const basePat2Y = calcCoupledPat24M(baseTakeCut, baseVolGrowth);
  const bullPat2Y = calcCoupledPat24M(bullTakeCut, bullVolGrowth);

  const igxOptionPerShare = igxCarbonValueCr / iexSharesCr;

  const bearValPerShare = (bearPat2Y * bearExitPe) / iexSharesCr;
  const baseValPerShare = (basePat2Y * baseExitPe) / iexSharesCr + igxOptionPerShare;
  const bullValPerShare = (bullPat2Y * bullExitPe) / iexSharesCr + igxOptionPerShare;

  const expectedValPerShare =
    wBear * bearValPerShare + wBase * baseValPerShare + wBull * bullValPerShare;
  const expectedDeltaPct = ((expectedValPerShare - iexSpotPrice) / iexSpotPrice) * 100;
  const bearDeltaPct = ((bearValPerShare - iexSpotPrice) / iexSpotPrice) * 100;
  const bullDeltaPct = ((bullValPerShare - iexSpotPrice) / iexSpotPrice) * 100;

  // --- CAMS Computations ---
  const camsBaseRev = 1580; // ₹ cr annualised baseline (85.6% MF, 14.4% KRA/Non-MF)
  const camsBaseMfRev = camsBaseRev * 0.856;
  const camsBaseKraRev = camsBaseRev * 0.144;
  const camsBaseEbitda = camsBaseRev * 0.4626;
  const camsBaseCosts = camsBaseRev - camsBaseEbitda;

  const staticTerHitPct = -(camsYieldCut / 46.26) * 100;
  const camsNextMfRev = camsBaseMfRev * (1 + camsAumGrowth / 100) * (1 - camsYieldCut / 100);
  const camsNextKraRev = camsBaseKraRev * (1 + camsKraNonMfGrowth / 100);
  const camsNextTotalRev = camsNextMfRev + camsNextKraRev;
  const dpdpIncrementalCostCr = camsNextTotalRev * (camsDpdpOverheadBps / 10000);
  const camsNextCosts = camsBaseCosts * 1.105 + dpdpIncrementalCostCr;
  const camsNextEbitda = camsNextTotalRev - camsNextCosts;
  const camsNextMarginPct = (camsNextEbitda / camsNextTotalRev) * 100;
  const camsEbitdaGrowthPct = ((camsNextEbitda - camsBaseEbitda) / camsBaseEbitda) * 100;
  const camsKraShareNextPct = (camsNextKraRev / camsNextTotalRev) * 100;

  // --- IRCTC Computations ---
  // Base annualised Ticketing Rev ~₹1,360 cr (~82% EBIT margin = ₹1,115 cr); Catering+RailNeer+Tourism ~₹4,120 cr (~11% margin)
  const baseTicketingRev = 1360;
  const baseOtherRev = 4120;
  const baseGroupEbitda = baseTicketingRev * 0.82 + baseOtherRev * 0.115; // ~₹1,589 cr (~29.0% blended)

  // Each 24-coach Vande Bharat Sleeper rake (~1,128 berths, AC pantry car) generates ~₹24.5 cr/yr catering + ticketing throughput
  const vb24IncrementalCateringCr = irctcVb24Rakes * 24.5;
  const nextTicketingRev =
    baseTicketingRev * (1 + irctcTicketingGrowth / 100) * (1 - irctcRailwaysFeeCutPct / 100);
  const nextTicketingEbitda = nextTicketingRev * 0.82 - (irctcRailwaysFeeCutPct > 0 ? 45 : 0);
  const nextCateringAndOtherRev = baseOtherRev * 1.12 + vb24IncrementalCateringCr;
  const nextCateringEbitda = nextCateringAndOtherRev * (irctcCateringMarginPct / 100);

  const nextIrctcTotalRev = nextTicketingRev + nextCateringAndOtherRev;
  const nextIrctcEbitda = nextTicketingEbitda + nextCateringEbitda;
  const nextIrctcMarginPct = (nextIrctcEbitda / nextIrctcTotalRev) * 100;
  const irctcEbitdaDeltaPct = ((nextIrctcEbitda - baseGroupEbitda) / baseGroupEbitda) * 100;

  const resetIexParadox = () => {
    setIexSpotPrice(105.25);
    setIexCoreRevCr(815);
    setIexNetMarginPct(66.0);
    setIexDividendPayoutPct(60);
    setBearProb(35);
    setBearTakeCut(-30);
    setBearVolGrowth(10);
    setBearExitPe(13);
    setBaseProb(45);
    setBaseTakeCut(-15);
    setBaseVolGrowth(12);
    setBaseExitPe(15);
    setBullProb(20);
    setBullTakeCut(0);
    setBullVolGrowth(15);
    setBullExitPe(20);
    setIgxCarbonValueCr(980);
  };

  const chartMin = 35;
  const chartMax = 205;
  const toX = (val: number) => {
    const clamped = Math.max(chartMin, Math.min(chartMax, val));
    return ((clamped - chartMin) / (chartMax - chartMin)) * 680 + 40;
  };

  return (
    <div className="space-y-10">
      {/* Header & Model Switcher */}
      <header className="border-b border-[#E5DFD5] pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs text-[#57534E]">
            12-to-24-Month Institutional Sensitivity Engine · Tabular Scenario Arithmetic
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917] headline-balance">
            Moat &amp; Regulatory Valuation Lab
          </h1>
          <p className="text-sm text-[#44403C] leading-relaxed">
            Quantify IEX’s ~66% net-margin coupling paradox, CAMS’ SEBI TER and DPDP Act sensitivity, and IRCTC’s 24-coach Vande Bharat Sleeper ramp against PSU convenience-fee sharing shocks.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-md self-start">
          <button
            type="button"
            onClick={() => setActiveModel('iex')}
            className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeModel === 'iex'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            IEX 66%-Margin Paradox
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('cams')}
            className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeModel === 'cams'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            CAMS TER &amp; DPDP Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('irctc')}
            className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeModel === 'irctc'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            IRCTC Sleeper &amp; PSU Risk
          </button>
        </div>
      </header>

      {/* ==================== MODULE 1: IEX PARADOX ==================== */}
      {activeModel === 'iex' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5DFD5] p-5">
              <div className="text-xs text-[#57534E]">Trailing Margin &amp; Carry Yield</div>
              <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#1C1917]">
                {iexNetMarginPct.toFixed(1)}% NPM
              </div>
              <div className="mt-1 text-xs font-mono tabular-nums text-[#1E3A8A]">
                Zero Debt · {iexImpliedYieldPct.toFixed(2)}% Div Yield
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD5] p-5">
              <div className="text-xs text-[#57534E]">Probability-Weighted 24M Value</div>
              <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#1E3A8A]">
                ₹{expectedValPerShare.toFixed(1)}
              </div>
              <div className="mt-1 text-xs font-mono tabular-nums text-[#44403C]">
                {expectedDeltaPct >= 0 ? '+' : ''}
                {expectedDeltaPct.toFixed(1)}% vs ₹{iexSpotPrice.toFixed(2)} (Near 52W Low)
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD5] p-5">
              <div className="text-xs text-[#57534E]">Coupled Fee-War Bear Case</div>
              <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#B91C1C]">
                ₹{bearValPerShare.toFixed(0)}
              </div>
              <div className="mt-1 text-xs font-mono tabular-nums text-[#B91C1C]">
                {bearDeltaPct.toFixed(1)}% · Reverse leverage hit
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD5] p-5">
              <div className="text-xs text-[#57534E]">Bull Re-Rating (Stay / RTM Surge)</div>
              <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#15803D]">
                ₹{bullValPerShare.toFixed(0)}
              </div>
              <div className="mt-1 text-xs font-mono tabular-nums text-[#15803D]">
                +{bullDeltaPct.toFixed(1)}% · Incl. ₹{igxOptionPerShare.toFixed(0)}/sh IGX+ICX
              </div>
            </div>
          </div>

          {/* SVG Dispersion Chart */}
          <div className="bg-white border border-[#E5DFD5] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                  The Margin-of-Safety Paradox: 24-Month Valuation Dispersion (₹ / Share)
                </h2>
                <p className="text-xs text-[#57534E]">
                  Why a ~66% trailing Net Profit Margin does not prevent downside when Grid India order-book pooling triggers PXIL/HPX fee competition.
                </p>
              </div>
              <button
                type="button"
                onClick={resetIexParadox}
                className="px-3 py-1.5 text-xs font-medium bg-[#F4F0EA] hover:bg-[#E5DFD5] text-[#1C1917] rounded inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Mandate Baseline</span>
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 760 155" className="w-full min-w-[600px] h-auto">
                {[50, 75, 100, 125, 150, 175, 200].map((tick) => {
                  const x = toX(tick);
                  return (
                    <g key={tick}>
                      <line x1={x} y1={25} x2={x} y2={115} stroke="#EFECE6" strokeWidth="1" />
                      <text
                        x={x}
                        y={136}
                        textAnchor="middle"
                        className="fill-[#78716C] text-[11px] font-mono"
                      >
                        ₹{tick}
                      </text>
                    </g>
                  );
                })}

                <line
                  x1={toX(bearValPerShare)}
                  y1={72}
                  x2={toX(bullValPerShare)}
                  y2={72}
                  stroke="#D6CFC4"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <line
                  x1={toX(iexSpotPrice)}
                  y1={22}
                  x2={toX(iexSpotPrice)}
                  y2={116}
                  stroke="#1C1917"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={toX(iexSpotPrice)}
                  y={16}
                  textAnchor="middle"
                  className="fill-[#1C1917] text-[11px] font-mono font-semibold"
                >
                  52W-Low Band ₹{iexSpotPrice.toFixed(1)}
                </text>

                <circle cx={toX(bearValPerShare)} cy={72} r={8} fill="#B91C1C" />
                <text
                  x={toX(bearValPerShare)}
                  y={55}
                  textAnchor="middle"
                  className="fill-[#B91C1C] text-[11px] font-mono font-semibold"
                >
                  Bear ₹{bearValPerShare.toFixed(0)}
                </text>

                <circle cx={toX(expectedValPerShare)} cy={72} r={9} fill="#1E3A8A" />
                <text
                  x={toX(expectedValPerShare)}
                  y={104}
                  textAnchor="middle"
                  className="fill-[#1E3A8A] text-[11px] font-mono font-semibold"
                >
                  EV ₹{expectedValPerShare.toFixed(0)}
                </text>

                <circle cx={toX(baseValPerShare)} cy={72} r={6} fill="#57534E" />
                <text
                  x={toX(baseValPerShare)}
                  y={55}
                  textAnchor="middle"
                  className="fill-[#57534E] text-[10px] font-mono"
                >
                  Base ₹{baseValPerShare.toFixed(0)}
                </text>

                <circle cx={toX(bullValPerShare)} cy={72} r={8} fill="#15803D" />
                <text
                  x={toX(bullValPerShare)}
                  y={55}
                  textAnchor="middle"
                  className="fill-[#15803D] text-[11px] font-mono font-semibold"
                >
                  Bull ₹{bullValPerShare.toFixed(0)}
                </text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white border border-[#E5DFD5] p-6 space-y-5 text-xs">
              <h3 className="font-serif text-base font-semibold text-[#1C1917] border-b border-[#EFECE6] pb-2.5">
                Core Financials &amp; IGX / Carbon Option
              </h3>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Spot Price Near 52W Low (₹)</span>
                  <span className="font-mono tabular-nums font-semibold">₹{iexSpotPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={75}
                  max={160}
                  step={0.25}
                  value={iexSpotPrice}
                  onChange={(e) => setIexSpotPrice(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Starting Net Profit Margin (%)</span>
                  <span className="font-mono tabular-nums font-semibold">{iexNetMarginPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={80}
                  step={0.5}
                  value={iexNetMarginPct}
                  onChange={(e) => setIexNetMarginPct(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">IGX Stake + Carbon Option Value (₹ cr)</span>
                  <span className="font-mono tabular-nums font-semibold">₹{igxCarbonValueCr} cr</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={2200}
                  step={50}
                  value={igxCarbonValueCr}
                  onChange={(e) => setIgxCarbonValueCr(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white border border-[#E5DFD5] p-5 space-y-4">
                <div className="border-b border-[#EFECE6] pb-2 flex justify-between">
                  <span className="font-semibold text-[#B91C1C]">Bear (PXIL/HPX Fee War)</span>
                  <span className="font-mono tabular-nums">{(wBear * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Weight</span>
                      <span className="font-mono tabular-nums">{bearProb}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={70}
                      step={5}
                      value={bearProb}
                      onChange={(e) => setBearProb(Number(e.target.value))}
                      className="w-full accent-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Take-Rate Cut</span>
                      <span className="font-mono tabular-nums">{bearTakeCut}%</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={-5}
                      step={5}
                      value={bearTakeCut}
                      onChange={(e) => setBearTakeCut(Number(e.target.value))}
                      className="w-full accent-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Exit P/E</span>
                      <span className="font-mono tabular-nums">{bearExitPe}x</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={18}
                      step={1}
                      value={bearExitPe}
                      onChange={(e) => setBearExitPe(Number(e.target.value))}
                      className="w-full accent-[#B91C1C]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5 space-y-4">
                <div className="border-b border-[#EFECE6] pb-2 flex justify-between">
                  <span className="font-semibold text-[#1C1917]">Base (DAM Coupled, RTM Buffer)</span>
                  <span className="font-mono tabular-nums">{(wBase * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Weight</span>
                      <span className="font-mono tabular-nums">{baseProb}%</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={75}
                      step={5}
                      value={baseProb}
                      onChange={(e) => setBaseProb(Number(e.target.value))}
                      className="w-full accent-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Take-Rate Cut</span>
                      <span className="font-mono tabular-nums">{baseTakeCut}%</span>
                    </div>
                    <input
                      type="range"
                      min={-30}
                      max={0}
                      step={5}
                      value={baseTakeCut}
                      onChange={(e) => setBaseTakeCut(Number(e.target.value))}
                      className="w-full accent-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Exit P/E</span>
                      <span className="font-mono tabular-nums">{baseExitPe}x</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={22}
                      step={1}
                      value={baseExitPe}
                      onChange={(e) => setBaseExitPe(Number(e.target.value))}
                      className="w-full accent-[#1E3A8A]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5 space-y-4">
                <div className="border-b border-[#EFECE6] pb-2 flex justify-between">
                  <span className="font-semibold text-[#15803D]">Bull (Coupling Stay / Deferral)</span>
                  <span className="font-mono tabular-nums">{(wBull * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Weight</span>
                      <span className="font-mono tabular-nums">{bullProb}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={bullProb}
                      onChange={(e) => setBullProb(Number(e.target.value))}
                      className="w-full accent-[#15803D]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>RTM + G-TAM Vol Growth</span>
                      <span className="font-mono tabular-nums">+{bullVolGrowth}%/yr</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={24}
                      step={1}
                      value={bullVolGrowth}
                      onChange={(e) => setBullVolGrowth(Number(e.target.value))}
                      className="w-full accent-[#15803D]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Exit P/E</span>
                      <span className="font-mono tabular-nums">{bullExitPe}x</span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={28}
                      step={1}
                      value={bullExitPe}
                      onChange={(e) => setBullExitPe(Number(e.target.value))}
                      className="w-full accent-[#15803D]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODULE 2: CAMS ==================== */}
      {activeModel === 'cams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-[#E5DFD5] p-6 space-y-5">
            <div className="border-b border-[#EFECE6] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                CAMS: SEBI TER Compression, KRA Expansion &amp; DPDP Act Lab
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Stress-test AMC telescopic bps yield resets and DPDP fiduciary compliance OPEX against organic SIP/AUM growth and KRA data verification.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">AMC Renewal RTA Yield Cut (SEBI TER Pass-Through)</span>
                  <span className="font-mono tabular-nums font-semibold text-[#B91C1C]">
                    -{camsYieldCut.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.5}
                  value={camsYieldCut}
                  onChange={(e) => setCamsYieldCut(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Serviced MF AUM Growth (SIP + MTM)</span>
                  <span className="font-mono tabular-nums font-semibold text-[#15803D]">
                    +{camsAumGrowth.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={25}
                  step={0.5}
                  value={camsAumGrowth}
                  onChange={(e) => setCamsAumGrowth(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">KRA Data Verification &amp; Non-MF Growth</span>
                  <span className="font-mono tabular-nums font-semibold text-[#15803D]">
                    +{camsKraNonMfGrowth.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={1}
                  value={camsKraNonMfGrowth}
                  onChange={(e) => setCamsKraNonMfGrowth(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">DPDP Act Cyber &amp; Audit Overhead (bps of Rev)</span>
                  <span className="font-mono tabular-nums font-semibold">{camsDpdpOverheadBps} bps</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={300}
                  step={10}
                  value={camsDpdpOverheadBps}
                  onChange={(e) => setCamsDpdpOverheadBps(Number(e.target.value))}
                  className="w-full accent-[#B45309]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">Unmitigated TER Yield Hit</div>
                <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#B91C1C]">
                  {staticTerHitPct.toFixed(1)}%
                </div>
                <div className="mt-1 text-xs text-[#57534E]">Static EBITDA impact pre-growth</div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">Net 12M EBITDA Growth</div>
                <div
                  className={`mt-1 font-mono tabular-nums text-2xl font-semibold ${
                    camsEbitdaGrowthPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {camsEbitdaGrowthPct >= 0 ? '+' : ''}
                  {camsEbitdaGrowthPct.toFixed(1)}%
                </div>
                <div className="mt-1 text-xs font-mono tabular-nums text-[#57534E]">
                  DPDP spend: ₹{dpdpIncrementalCostCr.toFixed(1)} cr
                </div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">Resulting EBITDA Margin</div>
                <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#1E3A8A]">
                  {camsNextMarginPct.toFixed(1)}%
                </div>
                <div className="mt-1 text-xs font-mono tabular-nums text-[#57534E]">
                  KRA/Non-MF mix: {camsKraShareNextPct.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD5] p-6 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#1C1917]">
                Commercial Moat Stress-Test Conclusion
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Even with a <span className="font-mono tabular-nums font-semibold">-{camsYieldCut.toFixed(1)}%</span> realized RTA yield cut passed down from SEBI TER rationalization and <span className="font-mono tabular-nums font-semibold">{camsDpdpOverheadBps} bps</span> (₹{dpdpIncrementalCostCr.toFixed(1)} cr) in incremental DPDP Act data-fiduciary audit/encryption overhead, CAMS compounds operating EBITDA by <span className="font-mono tabular-nums font-semibold text-[#15803D]">{camsEbitdaGrowthPct >= 0 ? '+' : ''}{camsEbitdaGrowthPct.toFixed(1)}%</span> at a <span className="font-mono tabular-nums font-semibold">{camsNextMarginPct.toFixed(1)}%</span> margin—demonstrating why institutional portfolios pay a ~38.6x compounder multiple.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODULE 3: IRCTC ==================== */}
      {activeModel === 'irctc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-[#E5DFD5] p-6 space-y-5">
            <div className="border-b border-[#EFECE6] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                IRCTC: 24-Coach Vande Bharat Sleeper vs. Sovereign Fee Risk
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Contrast near-term hospitality revenue from 24-coach sleeper rakes + AC pantry cars against Ministry convenience-fee sharing policy shocks.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Deployed 24-Coach Vande Bharat Sleeper Rakes</span>
                  <span className="font-mono tabular-nums font-semibold text-[#15803D]">
                    {irctcVb24Rakes} trainsets
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={irctcVb24Rakes}
                  onChange={(e) => setIrctcVb24Rakes(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Blended Catering &amp; Rail Neer EBIT Margin (%)</span>
                  <span className="font-mono tabular-nums font-semibold">{irctcCateringMarginPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={18}
                  step={0.5}
                  value={irctcCateringMarginPct}
                  onChange={(e) => setIrctcCateringMarginPct(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Sovereign Convenience-Fee Share Taken by Railways</span>
                  <span className="font-mono tabular-nums font-semibold text-[#B91C1C]">
                    {irctcRailwaysFeeCutPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={irctcRailwaysFeeCutPct}
                  onChange={(e) => setIrctcRailwaysFeeCutPct(Number(e.target.value))}
                  className="w-full accent-[#B91C1C]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#1C1917]">Organic Online Ticketing Volume Growth</span>
                  <span className="font-mono tabular-nums font-semibold">+{irctcTicketingGrowth.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.5}
                  value={irctcTicketingGrowth}
                  onChange={(e) => setIrctcTicketingGrowth(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">24-Coach Sleeper Rev Catalyst</div>
                <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#15803D]">
                  +₹{vb24IncrementalCateringCr.toFixed(0)} cr
                </div>
                <div className="mt-1 text-xs text-[#57534E]">
                  AC pantry car onboard hospitality
                </div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">Net Consolidated EBITDA YoY</div>
                <div
                  className={`mt-1 font-mono tabular-nums text-2xl font-semibold ${
                    irctcEbitdaDeltaPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {irctcEbitdaDeltaPct >= 0 ? '+' : ''}
                  {irctcEbitdaDeltaPct.toFixed(1)}%
                </div>
                <div className="mt-1 text-xs font-mono tabular-nums text-[#57534E]">
                  ₹{baseGroupEbitda.toFixed(0)} cr → ₹{nextIrctcEbitda.toFixed(0)} cr
                </div>
              </div>

              <div className="bg-white border border-[#E5DFD5] p-5">
                <div className="text-xs text-[#57534E]">Blended Group Margin</div>
                <div className="mt-1 font-mono tabular-nums text-2xl font-semibold text-[#1E3A8A]">
                  {nextIrctcMarginPct.toFixed(1)}%
                </div>
                <div className="mt-1 text-xs text-[#57534E]">
                  Diluted by pass-through catering mix
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD5] p-6 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#1C1917]">
                Why the Sovereign &ldquo;PSU Discount&rdquo; Persists
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Inducting <span className="font-mono tabular-nums font-medium">{irctcVb24Rakes}</span> 24-coach Vande Bharat Sleeper rakes adds <span className="font-mono tabular-nums font-semibold">₹{vb24IncrementalCateringCr.toFixed(0)} cr</span> in onboard AC pantry revenue, but at a <span className="font-mono tabular-nums">{irctcCateringMarginPct.toFixed(1)}%</span> catering margin (~₹{((vb24IncrementalCateringCr * irctcCateringMarginPct) / 100).toFixed(0)} cr EBIT). By contrast, if the Ministry of Railways claims even a 25%–50% share of online convenience fees (slide the sovereign fee-cut bar above), hundreds of crores of &gt;80%-margin profit vanish overnight—justifying our <strong>HOLD</strong> rating despite strong operational fleet growth.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
