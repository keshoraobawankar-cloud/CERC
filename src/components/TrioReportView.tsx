import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileDown,
  Printer,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  COMPANY_DOSSIERS,
  COUPLING_ARCHITECTURE_ROWS,
  IEX_PIVOT_SEGMENTS,
  MONETIZATION_VECTORS,
  PORTFOLIO_REVIEW_CHECKLIST,
  REPORT_METADATA,
  SOURCE_BIBLIOGRAPHY,
} from '../data/institutionalDataset';
import type { InstitutionalCall, LiveTickerPulse } from '../types/research';
import { exportTrioInstitutionalPdf } from '../utils/exportInstitutionalPdf';
import { EditorialImage } from './EditorialImage';

interface TrioReportViewProps {
  livePulses: Record<string, LiveTickerPulse>;
  refreshingTicker: string | null;
  pulseError: string | null;
  onRefreshTicker: (ticker: string, companyName: string, monitorables: string[]) => Promise<void>;
  onOpenValuationLab: (modelTab?: 'iex' | 'cams' | 'irctc') => void;
  onOpenThesisMonitor: () => void;
}

const CHAPTERS = [
  { id: 'sec-1', label: '01. Core Intermediary Mechanics' },
  { id: 'sec-2', label: '02. Moat & Regulatory Stress-Test' },
  { id: 'sec-3', label: '03. 12M Growth Drivers vs. Drags' },
  { id: 'sec-4', label: '04. Multiples & Sentiment Disconnect' },
  { id: 'sec-5', label: '05. Investment Thesis & Checklist' },
];

function getCallTextColor(call: InstitutionalCall): string {
  if (call === 'BUY') return 'text-[#15803D]';
  if (call === 'HOLD') return 'text-[#B45309]';
  return 'text-[#B91C1C]';
}

export function TrioReportView({
  livePulses,
  refreshingTicker,
  pulseError,
  onRefreshTicker,
  onOpenValuationLab,
  onOpenThesisMonitor,
}: TrioReportViewProps) {
  const [selectedDossierTicker, setSelectedDossierTicker] = useState<string>('CAMS');
  const [showPdfOptions, setShowPdfOptions] = useState<boolean>(false);
  const [recipientLabel, setRecipientLabel] = useState<string>('Institutional Portfolio Management Desk');
  const [includeTriggerAppendix, setIncludeTriggerAppendix] = useState<boolean>(true);
  const [includeLivePulses, setIncludeLivePulses] = useState<boolean>(true);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportedFileName, setExportedFileName] = useState<string | null>(null);
  const [showFloatingCornerPdf, setShowFloatingCornerPdf] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCornerPdf(window.scrollY > 340);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeDossier =
    COMPANY_DOSSIERS.find((d) => d.ticker === selectedDossierTicker) ?? COMPANY_DOSSIERS[0];

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      const filename = exportTrioInstitutionalPdf({
        recipientLabel: recipientLabel.trim() || 'Institutional Portfolio Management Desk',
        includeTriggerAppendix,
        includeLivePulses,
        livePulses,
      });
      setExportedFileName(filename);
      setTimeout(() => {
        setExportedFileName((prev) => (prev === filename ? null : prev));
      }, 4500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="relative space-y-12">
      {/* Scroll-Following Floating 'PDF' Action (Compositor-Only Opacity/Transform, <5% Viewport Height) */}
      <div
        className={`no-print fixed bottom-6 right-6 z-30 transition-all duration-150 ${
          showFloatingCornerPdf
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <button
          type="button"
          disabled={isExportingPdf}
          onClick={handleExportPdf}
          title="Download clean, printer-friendly PDF market research report"
          aria-label="Download printer-friendly PDF market research report"
          className="h-11 px-4 bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 text-white text-xs font-semibold rounded-md shadow-md transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          {exportedFileName ? (
            <>
              <Check className="w-4 h-4" />
              <span>PDF Saved</span>
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              <span>{isExportingPdf ? 'Generating...' : 'PDF'}</span>
            </>
          )}
        </button>
      </div>

      {/* Institutional Equity Research Masthead with Floating Header 'PDF' Control */}
      <header className="relative border-b border-[#E5DFD5] pb-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
            <span className="font-medium text-[#1C1917]">{REPORT_METADATA.desk}</span>
            <span aria-hidden="true">·</span>
            <span>{REPORT_METADATA.horizon}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{REPORT_METADATA.date}</span>
          </div>

          {/* Floating 'PDF' Action Cluster in TrioReportView Header */}
          <div className="no-print flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowPdfOptions((v) => !v)}
              title="Configure printer-friendly PDF options"
              className={`h-10 px-3 text-xs font-medium rounded-md border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                showPdfOptions
                  ? 'bg-[#EFECE6] text-[#1C1917] border-[#D6CFC4]'
                  : 'bg-white text-[#44403C] border-[#D6CFC4] hover:bg-[#F5F2EC]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>PDF Setup</span>
            </button>

            <button
              type="button"
              disabled={isExportingPdf}
              onClick={handleExportPdf}
              title="Generate clean, printer-friendly PDF report with all 5 sections & valuation tables"
              aria-label="PDF — Generate clean, printer-friendly PDF market research report"
              className="h-10 px-4 bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 text-white text-xs font-semibold rounded-md shadow-sm transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              {exportedFileName ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDF Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Generating PDF...' : 'PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Printer-Friendly PDF Distribution Strip */}
        {showPdfOptions && (
          <div className="no-print bg-white border border-[#D6CFC4] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-1.5">
              <label htmlFor="pdf-recipient" className="block text-xs font-semibold text-[#1C1917]">
                Printer-Friendly Distribution Header / Client Desk
              </label>
              <input
                id="pdf-recipient"
                type="text"
                value={recipientLabel}
                onChange={(e) => setRecipientLabel(e.target.value)}
                placeholder="e.g., India Long-Only Institutional Mandate"
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#D6CFC4] rounded text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center gap-4 pb-1.5 text-xs text-[#44403C]">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTriggerAppendix}
                  onChange={(e) => setIncludeTriggerAppendix(e.target.checked)}
                  className="accent-[#1E3A8A] rounded"
                />
                <span>Include Macro &amp; Policy Trigger Appendix</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLivePulses}
                  onChange={(e) => setIncludeLivePulses(e.target.checked)}
                  className="accent-[#1E3A8A] rounded"
                />
                <span>Embed Live Quotes ({Object.keys(livePulses).length})</span>
              </label>
            </div>

            <div className="md:col-span-2 flex md:justify-end">
              <button
                type="button"
                onClick={handleExportPdf}
                className="h-10 px-4 bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-medium rounded inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate PDF</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.7rem] font-semibold text-[#1C1917] leading-[1.13] headline-balance">
            {REPORT_METADATA.title}
          </h1>
          <p className="text-sm sm:text-base text-[#57534E]">
            {REPORT_METADATA.subtitle}
          </p>
        </div>

        {/* Executive Allocation Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPANY_DOSSIERS.map((d) => (
            <div key={d.ticker} className="bg-white border border-[#E5DFD5] p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span className="font-mono font-semibold text-[#1C1917]">
                  RANK 0{d.rank} · {d.ticker}
                </span>
                <span className={`font-mono font-semibold ${getCallTextColor(d.call)}`}>
                  {d.call} · {d.weightAllocation}
                </span>
              </div>
              <div className="font-serif text-base font-semibold text-[#1C1917]">{d.name}</div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono tabular-nums text-[#44403C]">
                <span>{livePulses[d.ticker]?.latestPrice ?? d.latestPrice}</span>
                <span aria-hidden="true">·</span>
                <span>P/E {d.forwardPe}</span>
                <span aria-hidden="true">·</span>
                <span>NPM {d.netMargin}</span>
              </div>
              <p className="text-xs text-[#57534E] pt-0.5">{d.moatClassification}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5DFD5] p-6 space-y-2">
          <div className="text-xs font-semibold text-[#1E3A8A]">
            Executive Investment Synthesis (12-to-24-Month Horizon)
          </div>
          <p className="text-sm sm:text-[15px] text-[#1C1917] leading-relaxed">
            {REPORT_METADATA.bottomLine}
          </p>
        </div>
      </header>

      {/* Asymmetric 70 / 30 Institutional Reading Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main 5-Section Analytical Essay Column (8 cols) */}
        <div className="lg:col-span-8 space-y-16">
          {/* ==================== SECTION 01 ==================== */}
          <section id="sec-1" className="scroll-mt-24 space-y-6">
            <div className="space-y-2.5">
              <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold text-[#1C1917]">
                01. Core Intermediary Mechanics &amp; Granular Pricing Architecture
              </h2>
              <p className="text-[15px] text-[#292524] leading-[1.78] max-w-prose first-letter:text-4xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1">
                While CAMS, IRCTC, and IEX are all zero-debt, asset-light intermediaries positioned between regulated counterparties, their monetization levers track completely distinct financial vectors. CAMS clips regressive basis-point slabs on mutual fund AUM alongside KRA KYC pulls; IRCTC extracts fixed digital convenience fees across 430M+ annual e-tickets layered with Rail Neer water and vendor catering revenue shares; and IEX collects a flat double-sided per-unit volume fee on spot power decoupled from electricity prices.
              </p>
            </div>

            {/* Granular Monetization Vector Architecture Diagram */}
            <div className="bg-white border border-[#E5DFD5] p-5 sm:p-6 space-y-4">
              <div className="border-b border-[#EFECE6] pb-3">
                <div className="text-xs font-semibold text-[#1C1917]">
                  Granular Monetization Flow Vectors
                </div>
                <p className="text-xs text-[#57534E] mt-0.5">
                  Tracing how economic value flows from end-market throughput into each intermediary’s revenue clip.
                </p>
              </div>

              <div className="divide-y divide-[#EFECE6]">
                {MONETIZATION_VECTORS.map((vec) => (
                  <div key={vec.ticker} className="py-4 first:pt-1 last:pb-0 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center font-mono text-xs">
                      <div className="sm:col-span-3 p-2.5 bg-[#FAF8F5] border border-[#E5DFD5] text-[#1C1917] font-medium">
                        {vec.originNode}
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-center gap-1 text-[11px] text-[#57534E] text-center">
                        <span>{vec.inboundFlow}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#1E3A8A]" />
                      </div>
                      <div className="sm:col-span-2 p-2.5 bg-[#F4F0EA] border border-[#D6CFC4] text-[#1C1917] font-semibold text-center">
                        {vec.intermediaryNode}
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-center gap-1 text-[11px] text-[#1E3A8A] font-semibold text-center tabular-nums">
                        <span>{vec.pricingClip}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <div className="sm:col-span-2 p-2.5 bg-[#FAF8F5] border border-[#E5DFD5] text-[#1C1917] font-medium">
                        {vec.counterpartyNode}
                      </div>
                    </div>
                    <p className="text-xs text-[#44403C] leading-relaxed">
                      <strong className="text-[#1C1917] font-mono">{vec.ticker}:</strong> {vec.pricingNuance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Clipping & Architecture Matrix */}
            <div className="bg-white border border-[#E5DFD5] overflow-x-auto">
              <div className="px-4 py-2.5 bg-[#F5F2EC] border-b border-[#E5DFD5] text-xs font-semibold text-[#1C1917]">
                Comparative Toll-Booth Mechanics &amp; Margin Structure
              </div>
              <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#EFECE6] text-[#57534E]">
                    <th className="py-3 px-4 w-36">Architectural Layer</th>
                    <th className="py-3 px-4">CAMS (RTA &amp; KRA)</th>
                    <th className="py-3 px-4">IRCTC (Statutory PSU)</th>
                    <th className="py-3 px-4">IEX (Power Exchange)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">Primary Counterparty</td>
                    <td className="py-3 px-4">AMCs (~68% industry AUM serviced) &amp; financial firms</td>
                    <td className="py-3 px-4">Rail passengers (430M+ e-tickets/yr) &amp; food licensees</td>
                    <td className="py-3 px-4">Power generators, State Discoms &amp; open-access C&amp;I</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">Granular Pricing Unit</td>
                    <td className="py-3 px-4 tabular-nums">0.02%–0.05% regressive AUM slabs (equity &gt; debt) + SIP volume</td>
                    <td className="py-3 px-4 tabular-nums">₹15 Non-AC / ₹30 AC e-ticket (~100% GM) + ~1.5M L/day Rail Neer</td>
                    <td className="py-3 px-4 tabular-nums">Flat 2p (₹0.02)/unit buyer + 2p seller across 96 daily blocks</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">Data / Adjacency Layer</td>
                    <td className="py-3 px-4">CAMS KRA (domestic &amp; non-resident KYC), CAMSfinserv, AIF/PMS</td>
                    <td className="py-3 px-4">Third-party vendor catering shares, Vande Bharat &amp; Amrit Bharat</td>
                    <td className="py-3 px-4">30-min RTM (~42%), G-TAM, coupling-exempt IGX (~47.3%) &amp; Carbon</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">Operating EBITDA Margin</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#15803D]">~46.3%</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#B45309]">~28.2%–33.5% (Blended)</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#1C1917]">~83.5% (~66% Core NPM)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">Cost Structure</td>
                    <td className="py-3 px-4">Fixed cloud ledger &amp; compliance stack + investor service ops</td>
                    <td className="py-3 px-4">Sunk ticketing servers (&gt;80% EBIT) blended with meal/water costs</td>
                    <td className="py-3 px-4">Pure matching &amp; clearing software; decoupled from power prices</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Deep-Dive Franchise Dossier Switcher */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFECE6] pb-4">
                <div className="text-xs font-semibold text-[#1C1917]">
                  Franchise Revenue-Clipping Breakdown
                </div>
                <div className="no-print flex items-center gap-1 p-1 bg-[#EFECE6] rounded-md">
                  {COMPANY_DOSSIERS.map((d) => (
                    <button
                      key={d.ticker}
                      type="button"
                      onClick={() => setSelectedDossierTicker(d.ticker)}
                      className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedDossierTicker === d.ticker
                          ? 'bg-white text-[#1C1917] shadow-xs'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      0{d.rank}. {d.ticker}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5">
                  <EditorialImage
                    src={activeDossier.editorialImage}
                    alt={`${activeDossier.name} infrastructure`}
                    caption={activeDossier.imageCaption}
                    ticker={activeDossier.ticker}
                    className="aspect-video"
                  />
                </div>
                <div className="md:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-mono font-semibold text-[#1C1917]">{activeDossier.ticker}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeDossier.sectorTag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">ROCE {activeDossier.roce}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                    {activeDossier.name}
                  </h3>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {activeDossier.section1Mechanics}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#F4F0EA] border border-[#E5DFD5] space-y-1.5">
              <div className="text-xs font-semibold text-[#1C1917]">
                Why Fixed-Cost Software Architectures Yield Massive EBITDA Margins
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Once automated auction algorithms (IEX), registrar folio ledgers and KRA APIs (CAMS), or national passenger reservation gateways (IRCTC Ticketing) are engineered and amortized, processing the ten-millionth transaction requires negligible incremental compute or headcount. Incremental revenue converts at 65%–95% contribution margins—explaining IEX’s ~83.5% EBITDA margin, IRCTC’s virtually 100% gross margin on ₹15/₹30 convenience fees (&gt;80% segment EBIT margin), and CAMS’ ~46.3% EBITDA margin. However, fixed-cost leverage is symmetrical: any regulator-enforced fee cut drops straight through to reduce pre-tax profit.
              </p>
            </div>
          </section>

          {/* ==================== SECTION 02 ==================== */}
          <section id="sec-2" className="scroll-mt-24 space-y-8 border-t border-[#E5DFD5] pt-12">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold text-[#1C1917]">
                02. Moat Classification &amp; Deep Regulatory Stress-Testing
              </h2>
              <p className="text-[15px] text-[#292524] leading-[1.75] max-w-prose">
                Evaluating intermediary durability requires isolating the single regulatory authority capable of compressing its profit margins overnight: SEBI for CAMS, the Ministry of Railways for IRCTC, and CERC for IEX.
              </p>
            </div>

            {/* 2A: CAMS vs SEBI */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                <div>
                  <div className="text-xs text-[#57534E]">
                    CAMS vs. SEBI · Commercial / KFintech Switching-Friction Moat
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                    The Mutual Fund Expense Ratio (TER) Cap &amp; Legacy Data Migration Friction
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenValuationLab('cams')}
                  className="no-print text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Stress-Test RTA Yields in Lab →
                </button>
              </div>
              <p className="text-sm text-[#292524] leading-relaxed">
                {COMPANY_DOSSIERS[0].section2MoatStressTest}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono tabular-nums text-xs">
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">2% Realized Slab Reset</div>
                  <div className="text-sm font-semibold text-[#B45309] mt-0.5">-4.3% Static EBITDA</div>
                  <div className="text-[11px] text-[#57534E]">Outpaced by ~16%+ SIP/AUM growth</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">5% Realized Slab Reset</div>
                  <div className="text-sm font-semibold text-[#B91C1C] mt-0.5">-10.9% Static EBITDA</div>
                  <div className="text-[11px] text-[#57534E]">Moderates net compounding to high single digits</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">10% Realized Slab Reset</div>
                  <div className="text-sm font-semibold text-[#B91C1C] mt-0.5">-21.7% Static EBITDA</div>
                  <div className="text-[11px] text-[#57534E]">Severe TER reset thesis-breaker</div>
                </div>
              </div>
            </div>

            {/* 2B: IRCTC vs Ministry of Railways */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-4">
              <div className="border-b border-[#EFECE6] pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[#57534E]">
                    IRCTC vs. Ministry of Railways · Statutory / Sovereign Monopoly Moat
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                    The &ldquo;PSU Discount&rdquo; &amp; the Late-2021 50% Convenience-Fee Split Precedent
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenValuationLab('irctc')}
                  className="no-print text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Simulate Fee-Split Shock →
                </button>
              </div>
              <p className="text-sm text-[#292524] leading-relaxed">
                {COMPANY_DOSSIERS[1].section2MoatStressTest}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono tabular-nums text-xs">
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">Late-2021 Stress Event</div>
                  <div className="text-sm font-semibold text-[#B91C1C] mt-0.5">-25% Morning Crash</div>
                  <div className="text-[11px] text-[#57534E]">50% fee-share order (reversed in 24h)</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">Ticketing Volume Base</div>
                  <div className="text-sm font-semibold text-[#1C1917] mt-0.5">430M+ e-Tickets/Yr</div>
                  <div className="text-[11px] text-[#57534E]">₹15 Non-AC / ₹30 AC (~100% Gross Margin)</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[#57534E]">Sovereign Shareholding</div>
                  <div className="text-sm font-semibold text-[#B45309] mt-0.5">~62.4% Govt Stake</div>
                  <div className="text-[11px] text-[#57534E]">Catering cap &amp; DIPAM OFS overhang</div>
                </div>
              </div>
            </div>

            {/* 2C: IEX vs CERC Market Coupling Schematic + Table */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-5">
              <div className="border-b border-[#EFECE6] pb-3">
                <div className="text-xs text-[#57534E]">
                  IEX vs. CERC · Liquidity / Two-Sided Network Effect Moat
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  How CERC Market Coupling via Grid India Deconstructs IEX’s Order-Book Monopoly
                </h3>
              </div>

              <p className="text-sm text-[#292524] leading-relaxed">
                {COMPANY_DOSSIERS[2].section2MoatStressTest}
              </p>

              {/* Visual Execution Architecture Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-3">
                  <div className="text-xs font-mono font-semibold text-[#1C1917]">
                    CURRENT TRADING ARCHITECTURE (IEX Monopoly)
                  </div>
                  <div className="p-3 bg-white border border-[#D6CFC4] font-mono text-xs space-y-2">
                    <div className="text-[#1E3A8A] font-semibold">IEX Order Book (85%+ Liquidity Pool)</div>
                    <div className="flex items-center justify-between gap-1 text-[11px] text-[#292524]">
                      <span className="px-2 py-1 bg-[#FAF8F5] border border-[#E5DFD5]">Buyers &amp; Sellers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                      <span className="px-2 py-1 bg-[#FAF8F5] border border-[#E5DFD5]">IEX Algorithm</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                      <span className="px-2 py-1 bg-[#F4F0EA] border border-[#D6CFC4] font-semibold">MCP</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    <strong className="text-[#1C1917]">Moat:</strong> Self-reinforcing liquidity network effect. Smaller exchanges (PXIL/HPX) fail to scale because they lack counterparty depth.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-3">
                  <div className="text-xs font-mono font-semibold text-[#B91C1C]">
                    FUTURE MARKET COUPLING (Grid India Entry)
                  </div>
                  <div className="p-3 bg-white border border-[#D6CFC4] font-mono text-xs flex items-center justify-between gap-2">
                    <div className="space-y-1 text-[11px] shrink-0">
                      <div className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E5DFD5]">IEX Bids</div>
                      <div className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E5DFD5]">PXIL Bids</div>
                      <div className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E5DFD5]">HPX Bids</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />
                    <div className="p-2 bg-[#FEF2F2] border border-[#FECACA] text-center text-[11px]">
                      <div className="font-semibold text-[#991B1B]">GRID INDIA</div>
                      <div className="text-[#7F1D1D]">Central Algorithm</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />
                    <div className="p-2 bg-[#F4F0EA] border border-[#D6CFC4] text-[11px] font-semibold text-center">
                      Single National MCP
                    </div>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    <strong className="text-[#B91C1C]">Result:</strong> IEX becomes a standardized bid-collection post. Its 85%+ liquidity advantage is instantly socialized across rivals.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E5DFD5]">
                <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F2EC] border-b border-[#E5DFD5] text-[#1C1917] font-semibold">
                      <th className="py-2.5 px-3 w-36">Auction Stage</th>
                      <th className="py-2.5 px-3">Standalone Blind Auction (Legacy)</th>
                      <th className="py-2.5 px-3">Coupled Regime (Grid India MCO)</th>
                      <th className="py-2.5 px-3">Structural Moat Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
                    {COUPLING_ARCHITECTURE_ROWS.map((row) => (
                      <tr key={row.step}>
                        <td className="py-2.5 px-3 font-semibold text-[#1C1917]">{row.step}</td>
                        <td className="py-2.5 px-3">{row.standaloneIex}</td>
                        <td className="py-2.5 px-3">{row.coupledGridIndia}</td>
                        <td className="py-2.5 px-3 text-xs text-[#B91C1C] font-medium">{row.moatImpact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ==================== SECTION 03 ==================== */}
          <section id="sec-3" className="scroll-mt-24 space-y-8 border-t border-[#E5DFD5] pt-12">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold text-[#1C1917]">
                03. 12-Month Operational Growth Drivers vs. Structural Drags
              </h2>
              <p className="text-[15px] text-[#292524] leading-[1.75] max-w-prose">
                Across the next 12 to 24 months, operational trajectories diverge sharply between sealed-window premium rail transit, DPDP data-clearinghouse monetization, and uncoupled energy derivatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IRCTC Sealed-Window Vande Bharat Sleeper & Amrit Bharat */}
              <div className="bg-white border border-[#E5DFD5] p-6 space-y-3">
                <div className="text-xs font-mono text-[#1E3A8A] font-medium">
                  IRCTC · STRUCTURAL SCALING &amp; CATERING MULTIPLIER
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Sealed-Window 24-Coach Vande Bharat Sleeper, AC Pantry &amp; Amrit Bharat Network
                </h3>
                <p className="text-sm text-[#292524] leading-relaxed">
                  {COMPANY_DOSSIERS[1].section3DriversVsDrags}
                </p>
              </div>

              {/* CAMS DPDP Defensive Wall & Global KRA */}
              <div className="bg-white border border-[#E5DFD5] p-6 space-y-3">
                <div className="text-xs font-mono text-[#15803D] font-medium">
                  CAMS · COMPLIANCE DEFENSIVE WALL
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  DPDP Data Clearinghouse &amp; Global Non-Resident Investor KRA Expansion
                </h3>
                <p className="text-sm text-[#292524] leading-relaxed">
                  {COMPANY_DOSSIERS[0].section3DriversVsDrags}
                </p>
              </div>
            </div>

            {/* IEX Defensive Pivot Breakdown */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#B45309] font-medium">
                  IEX · PIVOT TO NON-COUPLED VERTICALS
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Tight 30-Minute RTM Dispatch, Green Markets, Coupling-Exempt IGX &amp; Carbon Credits
                </h3>
                <p className="text-sm text-[#292524] leading-relaxed">
                  {COMPANY_DOSSIERS[2].section3DriversVsDrags}
                </p>
              </div>

              {/* Volume Share Bar */}
              <div className="space-y-2">
                <div className="w-full h-6 flex overflow-hidden rounded-xs border border-[#D6CFC4]">
                  <div style={{ width: '42%' }} className="bg-[#1E3A8A] h-full" title="RTM (30-min dispatch): ~42%" />
                  <div style={{ width: '37%' }} className="bg-[#64748B] h-full" title="DAM (Phase-1 Coupled): ~37%" />
                  <div style={{ width: '14%' }} className="bg-[#B45309] h-full" title="TAM/Contingency: ~14%" />
                  <div style={{ width: '7%' }} className="bg-[#15803D] h-full" title="Green Markets: ~7%" />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono tabular-nums text-[#57534E]">
                  <span>30-Min RTM ~42%</span>
                  <span>·</span>
                  <span>DAM ~37% (Phase-1 Coupled)</span>
                  <span>·</span>
                  <span>TAM/Contingency ~14%</span>
                  <span>·</span>
                  <span>Green + IGX/Carbon Optionality ~7%</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#EFECE6]">
                <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EFECE6] text-[#57534E]">
                      <th className="py-2 px-3">Pivot Engine</th>
                      <th className="py-2 px-3 text-right">Mix Share</th>
                      <th className="py-2 px-3">Coupling Shield Status</th>
                      <th className="py-2 px-3">12–24M Institutional Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
                    {IEX_PIVOT_SEGMENTS.map((seg) => (
                      <tr key={seg.segment}>
                        <td className="py-2.5 px-3 font-medium text-[#1C1917]">{seg.segment}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">~{seg.shareOfVolume}%</td>
                        <td className="py-2.5 px-3 text-xs text-[#57534E]">{seg.couplingShieldStatus}</td>
                        <td className="py-2.5 px-3 text-xs">{seg.strategicRead}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ==================== SECTION 04 ==================== */}
          <section id="sec-4" className="scroll-mt-24 space-y-8 border-t border-[#E5DFD5] pt-12">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold text-[#1C1917]">
                04. Valuation Multiples &amp; Market Sentiment Disconnect
              </h2>
              <p className="text-[15px] text-[#292524] leading-[1.75] max-w-prose">
                Equity markets assign valuation multiples based on terminal pricing-power sovereignty rather than trailing profitability. That principle explains why an insulated commercial duopoly (CAMS, ~38.6x P/E) trades at a substantial premium to a sovereign statutory bottleneck (IRCTC, ~31.0x P/E) and more than double an endangered liquidity monopoly (IEX, ~17.3x P/E near 52-week lows).
              </p>
            </div>

            {/* Valuation Comparison Matrix */}
            <div className="bg-white border border-[#E5DFD5] overflow-x-auto">
              <div className="px-4 py-2.5 bg-[#F5F2EC] border-b border-[#E5DFD5] text-xs font-semibold text-[#1C1917]">
                Institutional Valuation &amp; Financial Health Comparison Matrix
              </div>
              <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5DFD5] text-[#57534E] font-semibold">
                    <th className="py-3 px-4">Valuation &amp; Quality Metric</th>
                    <th className="py-3 px-4 text-right">CAMS (Commercial)</th>
                    <th className="py-3 px-4 text-right">IRCTC (Sovereign PSU)</th>
                    <th className="py-3 px-4 text-right">IEX (Endangered Liquidity)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Reference Price &amp; Band</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{COMPANY_DOSSIERS[0].latestPrice} (Premium)</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{COMPANY_DOSSIERS[1].latestPrice} (PSU Cap)</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#B91C1C] font-medium">{COMPANY_DOSSIERS[2].latestPrice} (Near 52W Lows)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Forward P/E Multiple</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">~38.6x</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">~31.0x</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">~17.3x</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Operating EBITDA Margin</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~46.3%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~28.2%–33.5%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~83.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Net Profit Margin (NPM)</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~32.2%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~24.1%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#15803D] font-semibold">~66.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Return on Capital (ROCE)</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">44.8%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">39.4%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">41.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Balance Sheet Leverage</td>
                    <td className="py-2.5 px-4 text-right">Zero Debt (Net Cash)</td>
                    <td className="py-2.5 px-4 text-right">Zero Debt (Net Cash)</td>
                    <td className="py-2.5 px-4 text-right font-medium">Zero Debt (Cash-Rich)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Dividend Yield</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~1.45%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">~1.65%</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-[#1E3A8A]">~3.45%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#1C1917]">Primary Multiple Driver</td>
                    <td className="py-2.5 px-4 text-right">KFintech switching moat + SIP runway</td>
                    <td className="py-2.5 px-4 text-right">Legal monopoly minus 2021-style PSU risk</td>
                    <td className="py-2.5 px-4 text-right">Grid India coupling 2p/unit fee risk</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dedicated Fund Manager Framework: The IEX Margin-of-Safety Paradox */}
            <div className="bg-white border border-[#E5DFD5] p-6 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE6] pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    Fund Manager Framework · The Optical Value Trap vs. Regulatory Option
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#1C1917] mt-0.5">
                    Deconstructing IEX’s ~66% Net Margin, Zero Debt &amp; ~3.45% Yield Near 52-Week Lows
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenValuationLab('iex')}
                  className="no-print px-3.5 py-2 bg-[#1E3A8A] text-white text-xs font-medium rounded-md hover:bg-[#172E6E] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Model Paradox in Valuation Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-sm text-[#292524] leading-[1.75]">
                Quantitative value screens routinely flag IEX as an anomaly: a debt-free market leader generating a <strong>~66% Net Profit Margin</strong>, &gt;40% ROCE, and a <strong>~3.45% dividend yield</strong> trading near 52-week lows (~17x P/E). A seasoned institutional fund manager views this through three analytical lenses:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-[#44403C]">
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5">
                  <div className="font-semibold text-[#1C1917]">1. Margin Level ≠ Margin of Safety</div>
                  <p>
                    Benjamin Graham’s margin of safety buffers against cyclical demand dips—not structural demonopolization. A 66% net margin exists solely because no rival could match IEX’s liquidity; pooling order books attacks the very source of that margin.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5">
                  <div className="font-semibold text-[#1C1917]">2. Reverse Operating Leverage</div>
                  <p>
                    With fixed technology costs, a 30% cut in IEX’s 2-paise/side fee to fend off PXIL/HPX fee rebates erodes pre-tax operating earnings almost 1-for-1, triggering simultaneous EPS contraction and P/E compression to ~12–13x (Bear value ~₹67, -36%).
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5">
                  <div className="font-semibold text-[#1C1917]">3. Carry Yield on Binary Policy</div>
                  <p>
                    Zero debt and a 3.45% dividend yield prevent solvency distress, turning IEX into a cash-paying regulatory call option (probability-weighted value ~₹112 vs ₹105 spot)—requiring strict CERC timeline monitoring to verify dividend safety.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== SECTION 05 ==================== */}
          <section id="sec-5" className="scroll-mt-24 space-y-8 border-t border-[#E5DFD5] pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold text-[#1C1917]">
                  05. Final Investment Thesis, Capital Allocation &amp; Portfolio Review Checklist
                </h2>
                <p className="text-[15px] text-[#292524] leading-[1.75]">
                  Prioritized institutional ranking for long-term risk-adjusted returns over a 12-to-24-month horizon, paired with explicit regulatory triggers and committee review checkpoints.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenThesisMonitor}
                className="no-print text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Stress-Test Live Policy Shocks in Thesis Monitor →
              </button>
            </div>

            <div className="space-y-5">
              {COMPANY_DOSSIERS.map((d) => (
                <article key={d.ticker} className="bg-white border border-[#E5DFD5] p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-3.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#1C1917]">PRIORITY #0{d.rank}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-serif text-lg font-semibold text-[#1C1917]">{d.ticker}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-mono font-semibold ${getCallTextColor(d.call)}`}>
                        {d.call}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#57534E]">{d.callSubtext}</span>
                    </div>
                    <div className="font-mono tabular-nums text-xs font-semibold text-[#1E3A8A]">
                      Recommended Sleeve Weight: {d.weightAllocation}
                    </div>
                  </div>

                  <p className="text-sm text-[#292524] leading-relaxed">{d.section5AllocationThesis}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#15803D] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {d.call === 'SELL / AVOID'
                            ? 'Triggers Validating Sell / Avoid Call'
                            : 'Macro & Regulatory Validation Triggers'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#44403C] leading-relaxed">
                        {d.validatesThesis.map((v) => (
                          <li key={v}>— {v}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#B91C1C] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>
                          {d.call === 'SELL / AVOID'
                            ? 'Upside Re-Rating Triggers (Breaks Bear Call)'
                            : 'Thesis-Breaking Risk Triggers'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#44403C] leading-relaxed">
                        {d.breaksThesis.map((b) => (
                          <li key={b}>— {b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Summary Checklist for Portfolio Review */}
            <div className="bg-white border border-[#E5DFD5] p-6 space-y-4">
              <div className="border-b border-[#EFECE6] pb-3">
                <div className="text-xs font-semibold text-[#1E3A8A]">
                  Institutional Committee Reference
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917] mt-0.5">
                  Summary Checklist for Portfolio Review
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PORTFOLIO_REVIEW_CHECKLIST.map((item) => (
                  <div key={item.ticker} className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-[#1C1917]">{item.ticker}</span>
                        <span className="text-[#57534E]">{item.call}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#1E3A8A]">{item.archetype}</div>
                      <p className="text-xs text-[#44403C] leading-relaxed">{item.checkpointSummary}</p>
                    </div>
                    <div className="pt-2 border-t border-[#E5DFD5] text-[11px] font-mono text-[#57534E]">
                      Watch: {item.primaryWatchMetric}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Reference Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E5DFD5] p-6 text-xs text-[#44403C]">
              <div className="space-y-2">
                <div className="font-semibold text-[#1C1917]">Regulatory Statutes &amp; Circulars Tracked</div>
                <ul className="space-y-1.5 leading-relaxed">
                  {SOURCE_BIBLIOGRAPHY.regulatoryFrameworks.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-[#1C1917]">Exchange &amp; Corporate Disclosures</div>
                <ul className="space-y-1.5 leading-relaxed">
                  {SOURCE_BIBLIOGRAPHY.companyDisclosures.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Right Margin Rail (4 cols) */}
        <aside className="no-print lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          {/* Five-Section Navigation & Quick PDF Export */}
          <div className="bg-white border border-[#E5DFD5] p-5 space-y-3.5">
            <div className="text-xs font-semibold text-[#1C1917] border-b border-[#EFECE6] pb-2.5">
              Institutional Mandate Sections
            </div>
            <nav className="flex flex-col space-y-2 text-xs">
              {CHAPTERS.map((ch) => (
                <a
                  key={ch.id}
                  href={`#${ch.id}`}
                  className="text-[#57534E] hover:text-[#1E3A8A] transition-colors py-0.5"
                >
                  {ch.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#EFECE6]">
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleExportPdf}
                className="w-full h-9 px-3 bg-[#F4F0EA] hover:bg-[#E5DFD5] text-[#1C1917] text-xs font-medium rounded transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{exportedFileName ? 'PDF Downloaded' : 'Download Printer-Friendly PDF'}</span>
              </button>
            </div>
          </div>

          {/* Live Search-Grounded NSE Quote & Regulatory Pulse */}
          <div className="bg-white border border-[#E5DFD5] p-5 space-y-4">
            <div className="space-y-1 border-b border-[#EFECE6] pb-3">
              <div className="text-xs font-semibold text-[#1C1917]">
                Live NSE / Regulatory Pulse Check
              </div>
              <p className="text-xs text-[#57534E]">
                Query live web filings and NSE/BSE quotes via server-side Google Search grounding.
              </p>
            </div>

            {pulseError && (
              <p className="text-xs text-[#B91C1C] bg-[#FEF2F2] p-2.5 border border-[#FECACA]">
                {pulseError}
              </p>
            )}

            <div className="divide-y divide-[#EFECE6]">
              {COMPANY_DOSSIERS.map((d) => {
                const pulse = livePulses[d.ticker];
                const isLoading = refreshingTicker === d.ticker;
                return (
                  <div key={d.ticker} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-semibold text-sm text-[#1C1917]">
                          {d.ticker}
                        </span>
                        <span className={`text-xs ml-2 font-mono font-semibold ${getCallTextColor(d.call)}`}>
                          {d.call}
                        </span>
                        <div className="text-xs text-[#57534E] font-mono tabular-nums mt-0.5">
                          {pulse ? pulse.latestPrice : `${d.latestPrice} · P/E ${d.forwardPe}`}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={refreshingTicker !== null}
                        onClick={() => onRefreshTicker(d.ticker, d.name, d.keyMonitorables)}
                        className="px-2.5 py-1 text-xs font-medium bg-[#F4F0EA] hover:bg-[#E5DFD5] disabled:opacity-50 text-[#1C1917] rounded inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{isLoading ? 'Checking...' : 'Live Pulse'}</span>
                      </button>
                    </div>

                    {pulse ? (
                      <div className="space-y-1.5 text-xs bg-[#FAF8F5] p-3 border border-[#EFECE6]">
                        <div className="flex items-center justify-between text-[#57534E]">
                          <span>
                            Signal: <strong className="text-[#1C1917]">{pulse.thesisSignal}</strong>
                          </span>
                          <span className="font-mono tabular-nums">{pulse.refreshedAt}</span>
                        </div>
                        <p className="text-[#292524] leading-relaxed">{pulse.latestQuarterSummary}</p>
                        <p className="text-[#57534E] leading-relaxed">{pulse.regulatoryPulse}</p>
                        {pulse.sources.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-2">
                            {pulse.sources.slice(0, 2).map((s, idx) =>
                              s.uri ? (
                                <a
                                  key={`${s.uri}-${idx}`}
                                  href={s.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1E3A8A] hover:underline inline-flex items-center gap-0.5"
                                >
                                  <span className="truncate max-w-[160px]">{s.title}</span>
                                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                                </a>
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-[#57534E]">
                        Monitor: {d.keyMonitorables[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
