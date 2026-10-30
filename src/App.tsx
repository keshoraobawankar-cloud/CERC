/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { INITIAL_DISPATCHES } from './data/institutionalDataset';
import { NavigationTab } from './types/research';
import type { GroundedSource, LiveTickerPulse, RegulatoryDispatch } from './types/research';
import { AggregatorView } from './components/AggregatorView';
import { TrioReportView } from './components/TrioReportView';
import { ValuationLabView } from './components/ValuationLabView';
import { BriefAuditorView } from './components/BriefAuditorView';

const STORAGE_DISPATCHES_KEY = 'artha_dispatches_v3';
const STORAGE_BOOKMARKS_KEY = 'artha_bookmarks_v3';
const STORAGE_WATCHLIST_KEY = 'artha_watchlist_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.Report);
  const [valuationInitialModel, setValuationInitialModel] = useState<'iex' | 'cams' | 'irctc'>('iex');

  const [dispatches, setDispatches] = useState<RegulatoryDispatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DISPATCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RegulatoryDispatch[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_DISPATCHES;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      return saved
        ? (JSON.parse(saved) as string[])
        : ['disp-cerc-coupling-grid', 'disp-sebi-ter-cams'];
    } catch {
      return ['disp-cerc-coupling-grid', 'disp-sebi-ter-cams'];
    }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WATCHLIST_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['CAMS', 'IRCTC', 'IEX'];
    } catch {
      return ['CAMS', 'IRCTC', 'IEX'];
    }
  });

  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  const [lastSweepSummary, setLastSweepSummary] = useState<string | null>(null);
  const [lastSweepSources, setLastSweepSources] = useState<GroundedSource[]>([]);

  const [livePulses, setLivePulses] = useState<Record<string, LiveTickerPulse>>({});
  const [refreshingTicker, setRefreshingTicker] = useState<string | null>(null);
  const [pulseError, setPulseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DISPATCHES_KEY, JSON.stringify(dispatches));
    } catch {
      // ignore
    }
  }, [dispatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const handleRunSweep = async (customQuery?: string, targetTickers?: string[]) => {
    setActiveTab(NavigationTab.Aggregator);
    setIsSweeping(true);
    setSweepError(null);

    try {
      const res = await fetch('/api/research/sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: customQuery,
          tickers: targetTickers ?? watchlist,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Live regulatory sweep failed.');
      }

      if (Array.isArray(data.dispatches) && data.dispatches.length > 0) {
        setDispatches((prev) => {
          const existingHeadlines = new Set(prev.map((p) => p.headline.toLowerCase()));
          const uniqueNew = (data.dispatches as RegulatoryDispatch[]).filter(
            (d) => !existingHeadlines.has(d.headline.toLowerCase())
          );
          return [...uniqueNew, ...prev];
        });
      }
      setLastSweepSummary(data.sweepSummary || null);
      setLastSweepSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setSweepError(err instanceof Error ? err.message : 'Unable to complete live research sweep.');
    } finally {
      setIsSweeping(false);
    }
  };

  const handleRefreshTicker = async (ticker: string, companyName: string, monitorables: string[]) => {
    setRefreshingTicker(ticker);
    setPulseError(null);
    try {
      const res = await fetch('/api/research/refresh-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          companyName,
          keyMonitorables: monitorables,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to refresh ${ticker}`);
      }
      setLivePulses((prev) => ({ ...prev, [ticker]: data as LiveTickerPulse }));
    } catch (err) {
      setPulseError(err instanceof Error ? err.message : 'Failed to refresh live quote.');
    } finally {
      setRefreshingTicker(null);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddTicker = (ticker: string) => {
    setWatchlist((prev) => (prev.includes(ticker) ? prev : [...prev, ticker]));
  };

  const handleRemoveTicker = (ticker: string) => {
    setWatchlist((prev) => prev.filter((t) => t !== ticker));
  };

  const handleResetWorkspace = () => {
    setDispatches(INITIAL_DISPATCHES);
    setWatchlist(['CAMS', 'IRCTC', 'IEX']);
    setLastSweepSummary(null);
    setLastSweepSources([]);
    localStorage.removeItem(STORAGE_DISPATCHES_KEY);
    localStorage.removeItem(STORAGE_WATCHLIST_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* Strictly Compliant 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E5DFD5]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab(NavigationTab.Report)}
            className="font-serif text-xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Artha Institutional
          </button>

          {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
          <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium text-[#57534E] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab(NavigationTab.Report)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === NavigationTab.Report
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-2 decoration-[#1E3A8A]'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Research Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(NavigationTab.Aggregator)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === NavigationTab.Aggregator
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-2 decoration-[#1E3A8A]'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Regulatory Radar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(NavigationTab.ValuationLab)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === NavigationTab.ValuationLab
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-2 decoration-[#1E3A8A]'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Valuation Lab
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(NavigationTab.ThesisMonitor)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === NavigationTab.ThesisMonitor
                  ? 'text-[#1C1917] underline underline-offset-8 decoration-2 decoration-[#1E3A8A]'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Thesis Monitor
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="shrink-0">
            <button
              type="button"
              disabled={isSweeping}
              onClick={() => handleRunSweep(undefined, watchlist)}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#292524] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isSweeping ? 'Sweeping...' : 'Run Live Sweep'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-10">
        {activeTab === NavigationTab.Report && (
          <TrioReportView
            livePulses={livePulses}
            refreshingTicker={refreshingTicker}
            pulseError={pulseError}
            onRefreshTicker={handleRefreshTicker}
            onOpenValuationLab={(modelTab) => {
              if (modelTab) setValuationInitialModel(modelTab);
              setActiveTab(NavigationTab.ValuationLab);
            }}
            onOpenThesisMonitor={() => setActiveTab(NavigationTab.ThesisMonitor)}
          />
        )}

        {activeTab === NavigationTab.Aggregator && (
          <AggregatorView
            dispatches={dispatches}
            bookmarkedIds={bookmarkedIds}
            watchlist={watchlist}
            isSweeping={isSweeping}
            sweepError={sweepError}
            lastSweepSummary={lastSweepSummary}
            lastSweepSources={lastSweepSources}
            onRunSweep={handleRunSweep}
            onToggleBookmark={handleToggleBookmark}
            onAddTicker={handleAddTicker}
            onRemoveTicker={handleRemoveTicker}
            onNavigateToReport={() => setActiveTab(NavigationTab.Report)}
            onNavigateToThesisMonitor={() => setActiveTab(NavigationTab.ThesisMonitor)}
          />
        )}

        {activeTab === NavigationTab.ValuationLab && (
          <ValuationLabView key={valuationInitialModel} initialTab={valuationInitialModel} />
        )}

        {activeTab === NavigationTab.ThesisMonitor && <BriefAuditorView />}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-[#E5DFD5] bg-[#F5F2EC] mt-16">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <p className="max-w-3xl leading-relaxed">
            Artha Institutional · India Financial Markets, Infrastructure &amp; PSU Research Desk (12–24 Month Horizon: CAMS vs. IRCTC vs. IEX). Analytical portfolio research framework only—not SEBI-registered personalised investment advice.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={handleResetWorkspace}
              className="text-[#57534E] hover:text-[#1C1917] hover:underline whitespace-nowrap cursor-pointer"
            >
              Reset Radar Baseline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
