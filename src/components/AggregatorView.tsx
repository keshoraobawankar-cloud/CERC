import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { RegulatorType } from '../types/research';
import type { GroundedSource, RegulatoryDispatch } from '../types/research';

interface AggregatorViewProps {
  dispatches: RegulatoryDispatch[];
  bookmarkedIds: string[];
  watchlist: string[];
  isSweeping: boolean;
  sweepError: string | null;
  lastSweepSummary: string | null;
  lastSweepSources: GroundedSource[];
  onRunSweep: (customQuery?: string, tickers?: string[]) => Promise<void>;
  onToggleBookmark: (id: string) => void;
  onAddTicker: (ticker: string) => void;
  onRemoveTicker: (ticker: string) => void;
  onNavigateToReport: () => void;
  onNavigateToThesisMonitor: () => void;
}

const REGULATOR_OPTIONS: RegulatorType[] = [
  RegulatorType.All,
  RegulatorType.SEBI,
  RegulatorType.CERC,
  RegulatorType.Railways,
  RegulatorType.MeitY,
  RegulatorType.PNGRB,
  RegulatorType.ExchangeFilings,
];

const PRESET_SWEEPS = [
  {
    label: 'SEBI MF TER & KRA Updates (CAMS)',
    query: 'Latest SEBI mutual fund total expense ratio TER circulars, KRA KYC verification rules, and CAMS AUM earnings updates',
  },
  {
    label: 'CERC Grid India Market Coupling (IEX)',
    query: 'Latest CERC Market Coupling Grid India order book pooling IEX PXIL HPX Real-Time Market RTM IGX updates',
  },
  {
    label: '24-Coach Vande Bharat Sleeper & IRCTC',
    query: 'Latest 24-coach Vande Bharat Sleeper trainsets AC pantry car rollout Ministry of Railways convenience fee and IRCTC results',
  },
  {
    label: 'DPDP Act Fiduciary & Carbon Market (CCTS)',
    query: 'Latest India DPDP Act Significant Data Fiduciary compliance rules and Indian Gas Exchange IGX Carbon Credit Trading Scheme updates',
  },
];

export function AggregatorView({
  dispatches,
  bookmarkedIds,
  watchlist,
  isSweeping,
  sweepError,
  lastSweepSummary,
  lastSweepSources,
  onRunSweep,
  onToggleBookmark,
  onAddTicker,
  onRemoveTicker,
  onNavigateToReport,
  onNavigateToThesisMonitor,
}: AggregatorViewProps) {
  const [selectedRegulator, setSelectedRegulator] = useState<string>(RegulatorType.All);
  const [selectedTicker, setSelectedTicker] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [sweepInput, setSweepInput] = useState('');
  const [newTickerInput, setNewTickerInput] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'disp-cerc-coupling-grid': true,
  });

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((d) => {
      if (showSavedOnly && !bookmarkedIds.includes(d.id)) return false;
      if (selectedRegulator !== RegulatorType.All && d.regulator !== selectedRegulator) {
        return false;
      }
      if (selectedTicker !== 'ALL' && !d.tickers.some((t) => t.toUpperCase() === selectedTicker)) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const haystack = `${d.headline} ${d.summary} ${d.transmissionMechanism} ${d.regulator} ${d.tickers.join(' ')} ${d.quantitativeTakeaway}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [dispatches, showSavedOnly, bookmarkedIds, selectedRegulator, selectedTicker, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCustomSweepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRunSweep(sweepInput.trim() || undefined, watchlist);
  };

  const handleAddWatchlistTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newTickerInput.trim().toUpperCase().replace(/[^A-Z0-9&-]/g, '');
    if (cleaned && cleaned.length <= 14) {
      onAddTicker(cleaned);
      setNewTickerInput('');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Regulator',
      'Tickers',
      'Category',
      'Verification',
      'Headline',
      'Quantitative Takeaway',
      'Transmission Mechanism',
    ];
    const rows = filteredDispatches.map((d) => [
      d.date,
      d.regulator,
      d.tickers.join('; '),
      d.category,
      d.verificationStatus,
      `"${d.headline.replace(/"/g, '""')}"`,
      `"${d.quantitativeTakeaway.replace(/"/g, '""')}"`,
      `"${d.transmissionMechanism.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artha-institutional-regulatory-radar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const leadDispatch = filteredDispatches[0];
  const secondaryDispatches = filteredDispatches.slice(1);

  return (
    <div className="space-y-12">
      {/* Masthead & Automated Live Search-Grounded Research Console */}
      <section className="border-b border-[#E5DFD5] pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span>Automated Regulatory &amp; Market Aggregator</span>
                <span aria-hidden="true">·</span>
                <span>SEBI / CERC &amp; Grid India / Railways / MeitY</span>
                <span aria-hidden="true">·</span>
                <span>12–24M Horizon</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.55rem] font-semibold tracking-tight text-[#1C1917] leading-[1.15] headline-balance">
                Indian Financial Markets, Infrastructure &amp; PSU Policy Radar
              </h1>
              <p className="text-[15px] text-[#44403C] leading-relaxed max-w-2xl">
                Monitor live regulatory circulars, market-coupling orders, TER slab adjustments, DPDP data-protection mandates, and fleet rollouts—mapping every development directly to intermediary moats and valuation multiples.
              </p>
            </div>

            {/* Live Search-Grounded Query Form */}
            <form onSubmit={handleCustomSweepSubmit} className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={sweepInput}
                    onChange={(e) => setSweepInput(e.target.value)}
                    placeholder="Search live Indian circulars or stocks (e.g., Grid India coupling, SEBI TER, Vande Bharat Sleeper)..."
                    className="w-full h-11 pl-10 pr-4 bg-white border border-[#D6CFC4] rounded-md text-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSweeping}
                  className="h-11 px-5 bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
                  <span>{isSweeping ? 'Scanning Sources...' : 'Aggregate Live Sources'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#57534E]">
                <span className="font-medium text-[#1C1917]">Mandate Sweeps:</span>
                {PRESET_SWEEPS.map((preset, index) => (
                  <span key={preset.label} className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSweeping}
                      onClick={() => {
                        setSweepInput(preset.query);
                        onRunSweep(preset.query, watchlist);
                      }}
                      className="text-[#1E3A8A] hover:underline disabled:opacity-50 text-left cursor-pointer"
                    >
                      {preset.label}
                    </button>
                    {index < PRESET_SWEEPS.length - 1 && <span aria-hidden="true">·</span>}
                  </span>
                ))}
              </div>
            </form>
          </div>

          {/* Right Summary Box: Institutional Allocation Ranking */}
          <div className="lg:col-span-5 bg-white border border-[#E5DFD5] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-1.5 border-b border-[#E5DFD5] pb-4">
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span>12–24M Institutional Sleeve</span>
                <span className="font-mono tabular-nums">Risk-Adjusted Priority</span>
              </div>
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                CAMS vs. IRCTC vs. IEX Allocation Matrix
              </h2>
            </div>

            <div className="divide-y divide-[#EFECE6] text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono tabular-nums text-xs text-[#57534E] mr-2">01.</span>
                  <span className="font-semibold text-[#1C1917]">CAMS</span>
                  <span className="text-xs font-mono font-semibold text-[#15803D] ml-2">BUY · 60%</span>
                </div>
                <div className="font-mono tabular-nums text-xs text-right text-[#44403C]">
                  ~38.6x P/E · 46.3% EBITDA
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono tabular-nums text-xs text-[#57534E] mr-2">02.</span>
                  <span className="font-semibold text-[#1C1917]">IRCTC</span>
                  <span className="text-xs font-mono font-semibold text-[#B45309] ml-2">HOLD · 30%</span>
                </div>
                <div className="font-mono tabular-nums text-xs text-right text-[#44403C]">
                  ~31.0x P/E · PSU Bottleneck
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono tabular-nums text-xs text-[#57534E] mr-2">03.</span>
                  <span className="font-semibold text-[#1C1917]">IEX</span>
                  <span className="text-xs font-mono font-semibold text-[#B91C1C] ml-2">SELL / AVOID · 10%</span>
                </div>
                <div className="font-mono tabular-nums text-xs text-right text-[#44403C]">
                  ~17.3x P/E · 66% NPM Paradox
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DFD5] text-xs">
              <button
                type="button"
                onClick={onNavigateToReport}
                className="font-medium text-[#1E3A8A] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Open 5-Section Research Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNavigateToThesisMonitor}
                className="font-medium text-[#57534E] hover:text-[#1C1917] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                View Validation &amp; Breaker Triggers
              </button>
            </div>
          </div>
        </div>

        {sweepError && (
          <div className="mt-6 p-4 bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
            <p>{sweepError}</p>
          </div>
        )}

        {isSweeping && (
          <div className="mt-6 p-5 bg-white border border-[#E5DFD5] space-y-3">
            <div className="h-4 w-56 bg-[#EFECE6] animate-pulse rounded" />
            <div className="h-3.5 w-full bg-[#F5F2EC] animate-pulse rounded" />
            <div className="h-3.5 w-4/5 bg-[#F5F2EC] animate-pulse rounded" />
          </div>
        )}

        {!isSweeping && lastSweepSummary && (
          <div className="mt-6 p-5 bg-white border border-[#D6CFC4] space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#15803D] font-medium">
              <span>Live Search-Grounded Institutional Synthesis</span>
              <span aria-hidden="true" className="text-[#78716C]">·</span>
              <span className="text-[#57534E] font-normal">Indian Regulatory &amp; Exchange Filings</span>
            </div>
            <p className="text-sm text-[#1C1917] leading-relaxed">{lastSweepSummary}</p>
            {lastSweepSources.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[#57534E]">
                <span className="font-medium text-[#1C1917]">Grounded Citations:</span>
                {lastSweepSources.slice(0, 6).map((src, idx) => (
                  <span key={`${src.uri}-${idx}`} className="inline-flex items-center gap-2">
                    {src.uri ? (
                      <a
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1E3A8A] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>{src.title}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span>{src.title}</span>
                    )}
                    {idx < Math.min(lastSweepSources.length, 6) - 1 && <span aria-hidden="true">·</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Filter Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-md overflow-x-auto">
            {REGULATOR_OPTIONS.map((reg) => {
              const active = selectedRegulator === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegulator(reg)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {reg}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter dispatches..."
                className="w-full h-9 pl-8 pr-3 bg-white border border-[#D6CFC4] rounded-md text-xs text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowSavedOnly((v) => !v)}
              className={`h-9 px-3.5 text-xs font-medium rounded-md border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                showSavedOnly
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white text-[#44403C] border-[#D6CFC4] hover:bg-[#F5F2EC]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="tabular-nums">Saved ({bookmarkedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="h-9 px-3.5 text-xs font-medium rounded-md bg-white text-[#44403C] border border-[#D6CFC4] hover:bg-[#F5F2EC] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Watchlist Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-[#E5DFD5]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-[#57534E] mr-2">Intermediary Watchlist:</span>
            <button
              type="button"
              onClick={() => setSelectedTicker('ALL')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTicker === 'ALL'
                  ? 'bg-[#1E3A8A] text-white font-medium'
                  : 'text-[#44403C] hover:bg-[#EFECE6]'
              }`}
            >
              ALL ({dispatches.length})
            </button>
            {watchlist.map((ticker) => {
              const isCore = ticker === 'CAMS' || ticker === 'IRCTC' || ticker === 'IEX';
              const active = selectedTicker === ticker;
              return (
                <div key={ticker} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedTicker(ticker)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#1E3A8A] text-white font-medium'
                        : 'text-[#44403C] hover:bg-[#EFECE6]'
                    }`}
                  >
                    {ticker}
                  </button>
                  {!isCore && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTicker === ticker) setSelectedTicker('ALL');
                        onRemoveTicker(ticker);
                      }}
                      aria-label={`Remove ${ticker}`}
                      className="p-1 text-[#78716C] hover:text-[#B91C1C] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddWatchlistTicker} className="flex items-center gap-1.5">
            <input
              type="text"
              value={newTickerInput}
              onChange={(e) => setNewTickerInput(e.target.value)}
              placeholder="Add NSE peer (e.g. KFINTECH)"
              className="h-8 w-44 px-2.5 bg-white border border-[#D6CFC4] rounded text-xs font-mono text-[#1C1917] placeholder:font-sans placeholder:text-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
            <button
              type="submit"
              className="h-8 px-2.5 bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#1C1917] text-xs font-medium rounded inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>
        </div>
      </section>

      {/* Feed */}
      {filteredDispatches.length === 0 ? (
        <div className="bg-white border border-[#E5DFD5] p-12 text-center space-y-3">
          <p className="font-serif text-lg text-[#1C1917]">No regulatory dispatches match the active filter.</p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRegulator(RegulatorType.All);
                setSelectedTicker('ALL');
                setSearchTerm('');
                setShowSavedOnly(false);
              }}
              className="px-4 py-2 text-xs font-medium bg-[#1C1917] text-white rounded-md hover:bg-[#292524] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <section className="space-y-8">
          {leadDispatch && (
            <article className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-semibold text-[#1E3A8A]">Lead Policy Dispatch</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{leadDispatch.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#1C1917]">{leadDispatch.regulator}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadDispatch.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{leadDispatch.tickers.join(' / ')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(leadDispatch.id)}
                  className="text-xs text-[#57534E] hover:text-[#1C1917] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedIds.includes(leadDispatch.id) ? 'fill-[#1C1917] text-[#1C1917]' : ''
                    }`}
                  />
                  <span>{bookmarkedIds.includes(leadDispatch.id) ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-[1.65rem] font-semibold text-[#1C1917] leading-snug headline-balance">
                {leadDispatch.headline}
              </h2>

              <p className="text-[15px] text-[#292524] leading-relaxed max-w-4xl">
                {leadDispatch.summary}
              </p>

              <div className="pt-4 border-t border-[#EFECE6] grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-1">
                  <div className="text-xs font-semibold text-[#1C1917]">
                    Moat &amp; Earnings Transmission
                  </div>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    {leadDispatch.transmissionMechanism}
                  </p>
                </div>
                <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917]">Quantitative Readout</div>
                    <div className="mt-1 font-mono tabular-nums text-xs text-[#1E3A8A] font-medium">
                      {leadDispatch.quantitativeTakeaway}
                    </div>
                  </div>
                  {leadDispatch.sources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#57534E]">
                      <span className="font-medium text-[#1C1917]">Sources:</span>
                      {leadDispatch.sources.map((s, idx) => (
                        <span key={`${s.title}-${idx}`} className="inline-flex items-center gap-2">
                          {s.uri ? (
                            <a
                              href={s.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1E3A8A] hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>{s.title}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          ) : (
                            <span>{s.title}</span>
                          )}
                          {idx < leadDispatch.sources.length - 1 && <span aria-hidden="true">·</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          )}

          {secondaryDispatches.length > 0 && (
            <div className="bg-white border border-[#E5DFD5] divide-y divide-[#E5DFD5]">
              {secondaryDispatches.map((item) => {
                const isExpanded = !!expandedIds[item.id];
                const isSaved = bookmarkedIds.includes(item.id);
                return (
                  <article key={item.id} className="p-5 sm:p-6 hover:bg-[#FAF8F5]/60 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                          {item.isLiveSweep && (
                            <>
                              <span className="font-semibold text-[#15803D]">Live Sweep</span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span className="font-mono tabular-nums">{item.date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[#1C1917]">{item.regulator}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-medium text-[#1E3A8A]">
                            {item.tickers.join(' / ')}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917] leading-snug">
                          {item.headline}
                        </h3>

                        <p className="text-sm text-[#44403C] leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                        <div className="font-mono tabular-nums text-xs text-[#1C1917] bg-[#F4F0EA] px-3 py-1.5 border border-[#E5DFD5]">
                          {item.quantitativeTakeaway}
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <button
                            type="button"
                            onClick={() => onToggleBookmark(item.id)}
                            className="text-[#57534E] hover:text-[#1C1917] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#1C1917] text-[#1C1917]' : ''}`} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            className="font-medium text-[#1E3A8A] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Transmission' : 'Transmission & Sources'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#EFECE6] grid grid-cols-1 md:grid-cols-12 gap-6 text-sm">
                        <div className="md:col-span-8 space-y-1">
                          <span className="text-xs font-semibold text-[#1C1917]">
                            Moat &amp; Multiple Transmission:
                          </span>
                          <p className="text-[#44403C] leading-relaxed">
                            {item.transmissionMechanism}
                          </p>
                        </div>
                        <div className="md:col-span-4 space-y-1">
                          <span className="text-xs font-semibold text-[#1C1917]">
                            Reference Sources:
                          </span>
                          <div className="flex flex-col gap-1 text-xs text-[#57534E]">
                            {item.sources.map((src, i) =>
                              src.uri ? (
                                <a
                                  key={`${src.uri}-${i}`}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
                                >
                                  <span className="truncate">{src.title}</span>
                                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                                </a>
                              ) : (
                                <span key={`${src.title}-${i}`}>{src.title}</span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
