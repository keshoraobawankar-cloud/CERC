import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please check Settings > Secrets in AI Studio.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface GroundedLink {
  title: string;
  uri: string;
}

function extractGroundedSources(response: unknown): GroundedLink[] {
  const res = response as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          web?: { uri?: string; title?: string };
        }>;
      };
    }>;
  };
  const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const links: GroundedLink[] = [];
  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      links.push({
        uri,
        title: chunk.web?.title?.trim() || new URL(uri).hostname.replace(/^www\./, ''),
      });
    }
  }
  return links;
}

function parseJsonFromModelText<T>(rawText: string, fallback: T): T {
  const cleaned = rawText.trim();
  if (!cleaned) return fallback;

  // Try direct JSON parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Strip markdown fences if present
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
      try {
        return JSON.parse(fenceMatch[1].trim()) as T;
      } catch {
        // continue to bracket scan
      }
    }
    // Find outermost JSON object or array
    const firstObj = cleaned.indexOf('{');
    const lastObj = cleaned.lastIndexOf('}');
    const firstArr = cleaned.indexOf('[');
    const lastArr = cleaned.lastIndexOf(']');

    if (firstObj !== -1 && lastObj > firstObj && (firstArr === -1 || firstObj < firstArr)) {
      try {
        return JSON.parse(cleaned.slice(firstObj, lastObj + 1)) as T;
      } catch {
        // ignore
      }
    }
    if (firstArr !== -1 && lastArr > firstArr) {
      try {
        return JSON.parse(cleaned.slice(firstArr, lastArr + 1)) as T;
      } catch {
        // ignore
      }
    }
  }
  return fallback;
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID') || msg.includes('GEMINI_API_KEY is missing')) {
    return {
      status: 403,
      message: 'API key error or permission denied. Please verify your Gemini API key in the Settings > Secrets panel.',
    };
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Gemini API quota reached (429). Upgrading to a billing-enabled API key in Settings > Secrets increases your research rate limits.',
    };
  }
  return {
    status: 500,
    message: msg || 'Unexpected error during live research synthesis.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // 1. Automated Live Indian Market News & Regulatory Sweep
  app.post('/api/research/sweep', async (req: Request, res: Response) => {
    try {
      const { query, regulators, tickers } = req.body as {
        query?: string;
        regulators?: string[];
        tickers?: string[];
      };

      const ai = getGenAIClient();
      const targetQuery = (query || '').trim() || 'Latest SEBI mutual fund TER & KRA circulars (CAMS), CERC Grid India power market coupling & RTM/IGX updates (IEX), and Ministry of Railways 24-coach Vande Bharat Sleeper & convenience fee updates (IRCTC)';
      const regulatorContext = Array.isArray(regulators) && regulators.length > 0 ? regulators.join(', ') : 'SEBI, CERC & Grid India, Ministry of Railways, MeitY (DPDP), PNGRB & Carbon, NSE / BSE Filings';
      const tickerContext = Array.isArray(tickers) && tickers.length > 0 ? tickers.join(', ') : 'CAMS, IRCTC, IEX';

      const hasUrls = /https?:\/\/\S+/i.test(targetQuery);
      const tools = hasUrls ? [{ googleSearch: {} }, { urlContext: {} }] : [{ googleSearch: {} }];

      const prompt = `Search current Indian financial news, regulator circulars (${regulatorContext}), and NSE/BSE exchange filings for:
"${targetQuery}"
Focus tickers/entities: ${tickerContext}.

Act as an institutional equity research analyst specializing in Indian financial markets, infrastructure, and PSUs over a 12-to-24-month horizon. Cross-reference findings against structural intermediary realities:
- CAMS: 0.02%–0.05% regressive AUM bps slabs outpaced by SIP volume, astronomical KFintech migration friction against SEBI TER cuts, and DPDP Act certified B2B data-clearinghouse + global non-resident KRA verification.
- IRCTC: 430M+ e-tickets/yr at fixed ₹15 Non-AC / ₹30 AC (~100% gross margin), ~1.5M L/day Rail Neer plants, third-party vendor catering shares, sealed-window 24-coach Vande Bharat Sleeper & Amrit Bharat digital catering multiplier, vs. late-2021-style Ministry 50% fee-split policy risk.
- IEX: Flat 2 paise/unit buyer + 2 paise/unit seller volume clearing (~66% Net Margin, zero debt, ~3.45% yield), CERC/Grid India market coupling socializing its 85%+ order book across PXIL/HPX, and pivot into tight 30-minute RTM (~42% mix) & coupling-exempt IGX natural gas.

Return ONLY valid JSON matching this exact object structure (no markdown commentary outside JSON):
{
  "sweepSummary": "2-sentence institutional synthesis of what changed and how it impacts moat durability, margins, or multiples over 12-24 months.",
  "dispatches": [
    {
      "headline": "Concise factual headline with entity and metric/action",
      "date": "DD MMM YYYY or MMM YYYY from the source",
      "regulator": "One of: SEBI | CERC & Grid India | Ministry of Railways | MeitY (DPDP) | PNGRB & Carbon | NSE / BSE Filings",
      "tickers": ["CAMS"],
      "category": "Circular / Order | Earnings Print | Market Structure | Fleet & Ops Catalyst",
      "verificationStatus": "Verified Primary | Press Excerpt | Policy Watch",
      "summary": "2-3 crisp sentences citing concrete numbers, circular details, or YoY changes.",
      "transmissionMechanism": "1-2 sentences explaining how this flows through fixed-cost operating leverage into take-rates, yields, catering margins, or P/E multiples.",
      "quantitativeTakeaway": "Short tabular figure string, e.g. '0.02%–0.05% Bps · EBITDA 46.3%' or 'IEX 2p+2p/kWh · ~66% NPM'"
    }
  ]
}
Provide 3 to 5 distinct, high-signal dispatches grounded in your search results.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a senior institutional equity research analyst specializing in Indian financial market infrastructure and PSUs (CAMS, IRCTC, IEX). Output clean JSON only.',
          tools,
        },
      });

      const rawText = response.text ?? '';
      const sources = extractGroundedSources(response);

      const parsed = parseJsonFromModelText<{
        sweepSummary?: string;
        dispatches?: Array<{
          headline?: string;
          date?: string;
          regulator?: string;
          tickers?: string[];
          category?: string;
          verificationStatus?: string;
          summary?: string;
          transmissionMechanism?: string;
          quantitativeTakeaway?: string;
        }>;
      }>(rawText, { sweepSummary: '', dispatches: [] });

      const dispatches = (parsed.dispatches ?? []).map((item, idx) => ({
        id: `live-${Date.now()}-${idx}`,
        headline: item.headline || 'Indian Regulatory & Market Update',
        date: item.date || 'Oct 2026',
        regulator: item.regulator || 'NSE / BSE Filings',
        tickers: Array.isArray(item.tickers) && item.tickers.length > 0 ? item.tickers : ['INDIA'],
        category: item.category || 'Policy Dispatch',
        verificationStatus: item.verificationStatus || 'Press Excerpt',
        summary: item.summary || rawText.slice(0, 320),
        transmissionMechanism: item.transmissionMechanism || 'Direct impact on intermediary pricing power or earnings multiple.',
        quantitativeTakeaway: item.quantitativeTakeaway || 'Live Web Sweep',
        sources: sources.slice(0, 5),
        isLiveSweep: true,
      }));

      res.json({
        sweepSummary: parsed.sweepSummary || 'Completed live search-grounded sweep across Indian financial press and regulatory filings.',
        dispatches,
        sources,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 2. Institutional Policy Scenario & Thesis Stress-Tester
  app.post('/api/research/audit-brief', async (req: Request, res: Response) => {
    try {
      const { briefText } = req.body as { briefText?: string };
      if (!briefText || briefText.trim().length < 15) {
        res.status(400).json({ error: 'Please enter a policy scenario, circular, or thesis of at least 15 characters to stress-test.' });
        return;
      }

      const ai = getGenAIClient();
      const hasUrls = /https?:\/\/\S+/i.test(briefText);
      const tools = hasUrls ? [{ googleSearch: {} }, { urlContext: {} }] : [{ googleSearch: {} }];

      const prompt = `Act as an institutional equity research analyst specializing in Indian financial markets, infrastructure, and PSUs (CAMS [BUY], IRCTC [HOLD], and IEX [SELL/AVOID] over a 12-to-24-month horizon).
Cross-reference and stress-test the following scenario, regulatory circular, or investment brief against live Indian web sources AND these verified structural benchmarks:
- CAMS: Slab-based regressive AUM fees (0.02%–0.05%) outpaced by SIP volume, high KFintech legacy-data switching friction against SEBI TER cuts, and DPDP Act certified B2B data clearinghouse + global non-resident KRA verification.
- IRCTC: 430M+ annual e-tickets (₹15 Non-AC / ₹30 AC at ~100% gross margin), ~1.5M L/day Rail Neer water plants, vendor catering shares, sealed-window 24-coach Vande Bharat Sleeper & Amrit Bharat digital catering, vs. late-2021 50% fee-split (-25% crash) Ministry policy risk.
- IEX: Flat 2 paise/unit buyer + 2 paise/unit seller volume clearing (~66% Net Margin, zero debt, ~3.45% yield), Grid India central algorithm socializing IEX’s 85%+ liquidity across PXIL/HPX, and defensive pivot into 30-min RTM (~42% mix) & coupling-exempt IGX gas.

--- SCENARIO / BRIEF TO EVALUATE ---
${briefText.trim()}
--- END ---

Return ONLY valid JSON matching this exact object structure:
{
  "executiveVerdict": "2-3 sentence institutional PM synthesis evaluating moat durability, fixed-cost margin transmission, and whether this validates or breaks the 12-24 month thesis.",
  "auditedClaims": [
    {
      "topic": "Short analytical dimension, e.g. 'Grid India Coupling Fee Impact' or 'SEBI TER Pass-Through'",
      "claimInBrief": "Core assumption or shock parameter being tested",
      "verifiedFinding": "Grounded empirical reality from current Indian filings, circulars, and financial metrics",
      "status": "Verified" | "Corrected" | "Unverified",
      "analyticalImpact": "Concrete 12-24M impact on EBITDA/PAT margins, terminal P/E multiple, and portfolio sizing"
    }
  ],
  "nextFilingsToVerify": [
    "Concrete regulatory order, quarterly print, or operational KPI for the PM to monitor next"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a meticulous institutional research auditor for Indian equities. Flag stale share prices, misquoted margins, and unnotified regulatory rollout dates rigorously. Output clean JSON only.',
          tools,
        },
      });

      const rawText = response.text ?? '';
      const sources = extractGroundedSources(response);
      const parsed = parseJsonFromModelText<{
        executiveVerdict?: string;
        auditedClaims?: Array<{
          topic?: string;
          claimInBrief?: string;
          verifiedFinding?: string;
          status?: 'Verified' | 'Corrected' | 'Unverified';
          analyticalImpact?: string;
        }>;
        nextFilingsToVerify?: string[];
      }>(rawText, {
        executiveVerdict: rawText.slice(0, 400) || 'Audit completed against live web sources.',
        auditedClaims: [],
        nextFilingsToVerify: [],
      });

      res.json({
        executiveVerdict: parsed.executiveVerdict || 'Audit completed against live Indian market sources.',
        auditedClaims: parsed.auditedClaims ?? [],
        nextFilingsToVerify: parsed.nextFilingsToVerify ?? [],
        sources,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 3. Live Single-Stock Price, Quarterly Print & Regulatory Pulse Refresh
  app.post('/api/research/refresh-ticker', async (req: Request, res: Response) => {
    try {
      const { ticker, companyName, keyMonitorables } = req.body as {
        ticker?: string;
        companyName?: string;
        keyMonitorables?: string[];
      };

      const symbol = (ticker || 'CAMS').trim();
      const name = (companyName || symbol).trim();
      const monitorList = Array.isArray(keyMonitorables) ? keyMonitorables.join('; ') : '';

      const ai = getGenAIClient();
      const prompt = `Search live Indian market sources (NSE/BSE quotes, quarterly results, and regulatory updates) for ${name} (NSE: ${symbol}).
Key thesis monitorables to check: ${monitorList || 'latest share price, latest quarterly revenue, EBITDA margin, PAT YoY growth, and recent regulatory circulars'}.

Return ONLY valid JSON matching this exact structure:
{
  "latestPrice": "Latest NSE/BSE price in ₹ with date, e.g. '₹796.60 (03 Aug 2026)'",
  "latestQuarterSummary": "Latest reported quarterly revenue, EBITDA margin, and PAT YoY growth with exact quarter label",
  "regulatoryPulse": "1-2 sentences on the latest regulatory or contract status affecting ${symbol}",
  "thesisSignal": "Strengthening | Intact | Watch Closely | Pressured"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an Indian institutional equity desk assistant. Quote exact dated NSE/BSE figures found in search results; never guess undated live quotes. Output clean JSON only.',
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text ?? '';
      const sources = extractGroundedSources(response);
      const parsed = parseJsonFromModelText<{
        latestPrice?: string;
        latestQuarterSummary?: string;
        regulatoryPulse?: string;
        thesisSignal?: string;
      }>(rawText, {});

      res.json({
        ticker: symbol,
        latestPrice: parsed.latestPrice || 'See grounded sources for latest quote',
        latestQuarterSummary: parsed.latestQuarterSummary || rawText.slice(0, 260),
        regulatoryPulse: parsed.regulatoryPulse || 'Monitor upcoming quarterly filing and regulator notifications.',
        thesisSignal: parsed.thesisSignal || 'Intact',
        refreshedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        sources,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Artha Institutional server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
