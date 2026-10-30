import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, FileSearch, AlertCircle, HelpCircle } from 'lucide-react';
import { SAMPLE_POLICY_SCENARIOS, THESIS_TRIGGER_MATRIX } from '../data/institutionalDataset';
import type { GroundedSource } from '../types/research';

interface StressTestImpactRow {
  topic?: string;
  claimInBrief?: string;
  verifiedFinding?: string;
  status?: 'Verified' | 'Corrected' | 'Unverified';
  analyticalImpact?: string;
}

interface StressTestResult {
  executiveVerdict: string;
  auditedClaims: StressTestImpactRow[];
  nextFilingsToVerify: string[];
  sources: GroundedSource[];
}

export function BriefAuditorView() {
  const [tickerFilter, setTickerFilter] = useState<'ALL' | 'CAMS' | 'IRCTC' | 'IEX'>('ALL');
  const [scenarioInput, setScenarioInput] = useState<string>(SAMPLE_POLICY_SCENARIOS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<StressTestResult | null>(null);

  const filteredTriggers = THESIS_TRIGGER_MATRIX.filter((row) => {
    if (tickerFilter === 'ALL') return true;
    return row.ticker === tickerFilter;
  });

  const handleRunStressTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/research/audit-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefText: scenarioInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to evaluate regulatory scenario.');
      }
      setLiveResult(data as StressTestResult);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Unexpected analysis error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSignalBadge = (status?: string) => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Validates Thesis</span>
        </span>
      );
    }
    if (status === 'Unverified') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#B45309]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Monitor Closely</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#B91C1C]">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Thesis Risk / Breaker</span>
      </span>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="border-b border-[#E5DFD5] pb-8 space-y-3">
        <div className="text-xs text-[#57534E]">
          12-to-24-Month Portfolio Surveillance · Macroeconomic &amp; Regulatory Triggers
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917] headline-balance">
          Institutional Thesis Monitor &amp; Policy Stress-Tester
        </h1>
        <p className="text-sm sm:text-[15px] text-[#44403C] max-w-3xl leading-relaxed">
          Track the exact regulatory and operational triggers governing our <strong>BUY (CAMS)</strong>, <strong>HOLD (IRCTC)</strong>, and <strong>SELL / AVOID (IEX)</strong> recommendations—or stress-test any live SEBI circular, CERC coupling notice, Railway Board directive, or broker thesis against grounded Indian market filings.
        </p>
      </header>

      {/* Live Search-Grounded Policy & Circular Stress-Tester */}
      <section className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
              Evaluate Live Policy Shock, Circular, or Investment Brief
            </h2>
            <p className="text-xs text-[#57534E]">
              Powered by server-side Google Search grounding across SEBI, CERC/Grid India, Ministry of Railways, MeitY, and NSE/BSE disclosures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#57534E] font-medium">Load Scenario:</span>
            {SAMPLE_POLICY_SCENARIOS.map((sample, idx) => (
              <span key={sample.label} className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScenarioInput(sample.text)}
                  className="text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  {sample.label}
                </button>
                {idx < SAMPLE_POLICY_SCENARIOS.length - 1 && <span aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleRunStressTest} className="space-y-4">
          <textarea
            rows={4}
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            placeholder="Paste a regulatory circular, policy shock scenario, or broker thesis on CAMS, IRCTC, IEX, or Indian market infrastructure..."
            className="w-full p-4 bg-[#FAF8F5] border border-[#D6CFC4] rounded-md text-sm text-[#1C1917] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#57534E]">
              Evaluates moat durability, fixed-cost margin transmission, and 12–24M thesis validation/breaker status.
            </span>
            <button
              type="submit"
              disabled={isAnalyzing || scenarioInput.trim().length < 15}
              className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-md inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileSearch className="w-4 h-4" />
              <span>{isAnalyzing ? 'Running Institutional Stress-Test...' : 'Run Grounded Stress-Test'}</span>
            </button>
          </div>
        </form>

        {analysisError && (
          <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
            {analysisError}
          </div>
        )}

        {isAnalyzing && (
          <div className="pt-4 border-t border-[#EFECE6] space-y-3">
            <div className="h-4 w-64 bg-[#EFECE6] animate-pulse rounded" />
            <div className="h-16 w-full bg-[#F5F2EC] animate-pulse rounded" />
          </div>
        )}

        {!isAnalyzing && liveResult && (
          <div className="pt-6 border-t border-[#E5DFD5] space-y-6">
            <div className="p-5 bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
              <div className="text-xs font-semibold text-[#1E3A8A]">
                Institutional Analyst Synthesis
              </div>
              <p className="text-sm text-[#1C1917] leading-relaxed">{liveResult.executiveVerdict}</p>
            </div>

            {liveResult.auditedClaims.length > 0 && (
              <div className="overflow-x-auto border border-[#E5DFD5]">
                <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F2EC] border-b border-[#E5DFD5] text-[#1C1917] font-semibold">
                      <th className="py-3 px-4 w-40">Analytical Dimension</th>
                      <th className="py-3 px-4">Scenario / Assumption Tested</th>
                      <th className="py-3 px-4">Grounded Market &amp; Policy Reality</th>
                      <th className="py-3 px-4 w-36">Thesis Signal</th>
                      <th className="py-3 px-4">12–24M Earnings &amp; Multiple Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
                    {liveResult.auditedClaims.map((c, idx) => (
                      <tr key={`${c.topic}-${idx}`}>
                        <td className="py-3 px-4 font-semibold text-[#1C1917]">{c.topic}</td>
                        <td className="py-3 px-4 text-[#57534E]">{c.claimInBrief}</td>
                        <td className="py-3 px-4">{c.verifiedFinding}</td>
                        <td className="py-3 px-4">{renderSignalBadge(c.status)}</td>
                        <td className="py-3 px-4 text-[#44403C]">{c.analyticalImpact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {liveResult.nextFilingsToVerify.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-[#1C1917]">Key Upcoming Monitorables:</div>
                  <ul className="space-y-1 text-[#44403C]">
                    {liveResult.nextFilingsToVerify.map((f, idx) => (
                      <li key={idx}>— {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {liveResult.sources.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-[#1C1917]">Grounded Web Sources:</div>
                  <div className="flex flex-col gap-1">
                    {liveResult.sources.slice(0, 6).map((src, idx) =>
                      src.uri ? (
                        <a
                          key={`${src.uri}-${idx}`}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate">{src.title}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span key={idx} className="text-[#57534E]">{src.title}</span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 12-24M Macroeconomic & Regulatory Trigger Matrix */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              12-to-24-Month Macroeconomic &amp; Regulatory Trigger Schedule
            </h2>
            <p className="text-xs text-[#57534E] mt-0.5">
              Specific policy, volume, and margin thresholds that validate or break our institutional calls.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-md self-start">
            {(['ALL', 'CAMS', 'IRCTC', 'IEX'] as const).map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => setTickerFilter(ticker)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  tickerFilter === ticker
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {ticker === 'ALL' ? 'All Coverage' : ticker}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E5DFD5] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="bg-[#F5F2EC] border-b border-[#E5DFD5] text-[#1C1917] font-semibold">
                <th className="py-3 px-4 w-36">Stock &amp; Call</th>
                <th className="py-3 px-4 w-48">Regulatory / Operational Domain</th>
                <th className="py-3 px-4">Validates Institutional Thesis</th>
                <th className="py-3 px-4">Breaks Thesis / Forces Rating Change</th>
                <th className="py-3 px-4 w-28">Horizon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[#292524]">
              {filteredTriggers.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF8F5]/60">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-semibold text-[#1C1917]">{row.ticker}</div>
                    <div
                      className={`font-mono text-[11px] font-semibold mt-0.5 ${
                        row.recommendation === 'BUY'
                          ? 'text-[#15803D]'
                          : row.recommendation === 'HOLD'
                            ? 'text-[#B45309]'
                            : 'text-[#B91C1C]'
                      }`}
                    >
                      {row.recommendation}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1C1917]">{row.domain}</div>
                    <div className="text-[11px] text-[#57534E] mt-0.5">{row.triggerParameter}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#292524] leading-relaxed">
                    {row.validationCondition}
                  </td>
                  <td className="py-3.5 px-4 text-[#44403C] leading-relaxed">
                    {row.breakerCondition}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-[#57534E]">
                    {row.horizonWindow}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
