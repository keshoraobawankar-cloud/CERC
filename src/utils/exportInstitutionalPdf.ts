import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  COMPANY_DOSSIERS,
  COUPLING_ARCHITECTURE_ROWS,
  IEX_PIVOT_SEGMENTS,
  MONETIZATION_VECTORS,
  PORTFOLIO_REVIEW_CHECKLIST,
  REPORT_METADATA,
  SOURCE_BIBLIOGRAPHY,
  THESIS_TRIGGER_MATRIX,
} from '../data/institutionalDataset';
import type { LiveTickerPulse } from '../types/research';

export interface PdfExportOptions {
  recipientLabel?: string;
  includeTriggerAppendix?: boolean;
  includeLivePulses?: boolean;
  livePulses?: Record<string, LiveTickerPulse>;
}

function cleanPdfText(input: string): string {
  return input
    .replace(/₹\s*/g, 'INR ')
    .replace(/[—–]/g, ' - ')
    .replace(/\s+-\s+/g, ' - ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/≈/g, '~')
    .replace(/≠/g, '!=')
    .replace(/÷/g, '/')
    .replace(/×/g, 'x')
    .replace(/►|→/g, '->')
    .replace(/·/g, '|')
    .replace(/\s+/g, ' ')
    .trim();
}

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

export function exportTrioInstitutionalPdf(options: PdfExportOptions = {}): string {
  const {
    recipientLabel = 'Institutional Portfolio Management Desk',
    includeTriggerAppendix = true,
    includeLivePulses = true,
    livePulses = {},
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }) as JsPdfWithAutoTable;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 19;

  // Printer-friendly palette: crisp white paper, deep charcoal ink, subtle hairline borders, light gray table headers
  const INK_PRIMARY: [number, number, number] = [24, 24, 27];
  const INK_BODY: [number, number, number] = [39, 39, 42];
  const INK_MUTED: [number, number, number] = [82, 82, 91];
  const ACCENT_NAVY: [number, number, number] = [30, 58, 138];
  const BORDER_GRAY: [number, number, number] = [212, 212, 216];
  const HEADER_FILL: [number, number, number] = [244, 244, 245];
  const ZEBRA_FILL: [number, number, number] = [250, 250, 250];

  let cursorY = 15;

  const ensureSpace = (neededMm: number) => {
    if (cursorY + neededMm > bottomLimit) {
      doc.addPage();
      cursorY = 21;
    }
  };

  const writeSectionHeading = (title: string) => {
    ensureSpace(17);
    cursorY += 3.5;
    doc.setDrawColor(...INK_PRIMARY);
    doc.setLineWidth(0.35);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
    cursorY += 5.5;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INK_PRIMARY);
    doc.text(cleanPdfText(title), marginX, cursorY);
    cursorY += 5;
  };

  const writeSubHeading = (subtitle: string) => {
    ensureSpace(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(...ACCENT_NAVY);
    doc.text(cleanPdfText(subtitle), marginX, cursorY);
    cursorY += 4.3;
  };

  const writeParagraph = (text: string, fontSize = 8.7) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...INK_BODY);
    const lines = doc.splitTextToSize(cleanPdfText(text), contentWidth);
    const blockHeight = lines.length * (fontSize * 0.44) + 2;
    ensureSpace(blockHeight);
    doc.text(lines, marginX, cursorY);
    cursorY += blockHeight;
  };

  // ==================== PAGE 1: PRINTER-FRIENDLY COVER MASTHEAD ====================
  doc.setDrawColor(...INK_PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
  cursorY += 5.5;

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...INK_PRIMARY);
  doc.text('ARTHA INSTITUTIONAL', marginX, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...ACCENT_NAVY);
  doc.text(
    cleanPdfText(`PRINTER-FRIENDLY EDITION | ${recipientLabel.toUpperCase()}`),
    pageWidth - marginX,
    cursorY - 0.5,
    { align: 'right' }
  );

  cursorY += 4.2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(...INK_MUTED);
  doc.text(cleanPdfText(REPORT_METADATA.desk), marginX, cursorY);
  doc.text(
    cleanPdfText(`${REPORT_METADATA.horizon} | ${REPORT_METADATA.date}`),
    pageWidth - marginX,
    cursorY,
    { align: 'right' }
  );

  cursorY += 3.2;
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.25);
  doc.line(marginX, cursorY, marginX + contentWidth, cursorY);

  cursorY += 7;
  doc.setFont('times', 'bold');
  doc.setFontSize(15.5);
  doc.setTextColor(...INK_PRIMARY);
  const titleLines = doc.splitTextToSize(cleanPdfText(REPORT_METADATA.title), contentWidth);
  doc.text(titleLines, marginX, cursorY);
  cursorY += titleLines.length * 6.3 + 2;

  // Printer-Friendly Executive Synthesis Box (white/subtle border, zero heavy ink fill)
  const bottomClean = cleanPdfText(REPORT_METADATA.bottomLine);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const blLines = doc.splitTextToSize(bottomClean, contentWidth - 8);
  const blBoxHeight = blLines.length * 4.0 + 11;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.rect(marginX, cursorY, contentWidth, blBoxHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(...ACCENT_NAVY);
  doc.text('EXECUTIVE INVESTMENT SYNTHESIS (12-TO-24-MONTH HORIZON)', marginX + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_PRIMARY);
  doc.text(blLines, marginX + 4, cursorY + 9.5);
  cursorY += blBoxHeight + 4.5;

  // Executive Portfolio Ranking Table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [
      [
        'Rank & Stock',
        'Call',
        'Sleeve Wt.',
        'Ref. Price',
        'Fwd P/E',
        'EBITDA / NPM',
        'Div. Yield',
        'Moat Classification',
      ],
    ],
    body: COMPANY_DOSSIERS.map((d) => {
      const pulse = includeLivePulses ? livePulses[d.ticker] : undefined;
      const priceLabel = pulse ? `${pulse.latestPrice} [Live]` : d.latestPrice;
      return [
        cleanPdfText(`#0${d.rank} ${d.ticker}`),
        cleanPdfText(d.call),
        cleanPdfText(d.weightAllocation),
        cleanPdfText(priceLabel),
        cleanPdfText(d.forwardPe),
        cleanPdfText(`${d.ebitdaMargin} / ${d.netMargin}`),
        cleanPdfText(d.dividendYield),
        cleanPdfText(d.moatClassification),
      ];
    }),
    styles: {
      font: 'helvetica',
      fontSize: 7.7,
      cellPadding: 2.2,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
      lineColor: INK_PRIMARY,
      lineWidth: 0.25,
    },
    alternateRowStyles: {
      fillColor: ZEBRA_FILL,
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  const activePulses = includeLivePulses ? Object.values(livePulses) : [];
  if (activePulses.length > 0) {
    ensureSpace(18);
    writeSubHeading('Live Session Search-Grounded Market Updates');
    for (const p of activePulses) {
      writeParagraph(
        `${p.ticker} (${p.refreshedAt} | Signal: ${p.thesisSignal} | Quote: ${p.latestPrice}): ${p.latestQuarterSummary} ${p.regulatoryPulse}`,
        8.1
      );
    }
  }

  // ==================== SECTION 1 ====================
  writeSectionHeading('1. Core Intermediary Mechanics & Granular Pricing Architecture');
  writeParagraph(
    'While CAMS, IRCTC, and IEX are all zero-debt, asset-light intermediaries sitting between regulated counterparties, their monetization vectors track completely distinct variables: CAMS clips regressive basis points on Mutual Fund AUM, IRCTC extracts fixed digital convenience fees plus catering and water tolls, and IEX clips flat per-unit power volumes.'
  );

  // Granular Monetization Vector Flow Table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [
      [
        'Entity',
        'Monetization Vector Flow (Origin -> Intermediary -> Counterparty)',
        'Granular Pricing Architecture',
      ],
    ],
    body: MONETIZATION_VECTORS.map((v) => [
      cleanPdfText(v.ticker),
      cleanPdfText(`[${v.originNode}] --(${v.inboundFlow})--> ${v.intermediaryNode} --(${v.pricingClip})--> [${v.counterpartyNode}]`),
      cleanPdfText(v.pricingNuance),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.1,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      valign: 'top',
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 18 },
      1: { cellWidth: 78 },
      2: { cellWidth: 86 },
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  for (const d of COMPANY_DOSSIERS) {
    writeSubHeading(`${d.ticker} (${d.name}) - ${d.sectorTag}`);
    writeParagraph(d.section1Mechanics, 8.5);
  }

  writeParagraph(
    'Fixed-Cost Software Operating Leverage: Once automated matching engines (IEX), registrar folio ledgers and KRA switches (CAMS), or national rail reservation gateways (IRCTC Ticketing) are built, processing incremental volume requires near-zero marginal cost. Pure software tolls achieve ~46.3% to ~83.5% EBITDA margins, whereas IRCTC blends ~100%-gross-margin e-ticketing with physical catering and Rail Neer costs (~28.2%-33.5% group EBITDA).'
  );

  // ==================== SECTION 2 ====================
  writeSectionHeading('2. Moat Classification & Deep Regulatory Stress-Testing');
  for (const d of COMPANY_DOSSIERS) {
    writeSubHeading(`${d.ticker}: ${d.moatClassification} (${d.moatVulnerabilityRating})`);
    writeParagraph(d.section2MoatStressTest, 8.5);
  }

  // Architectural Execution Shift Summary + 5-Stage Table
  writeSubHeading('IEX vs. CERC Execution Logic Shift: Standalone Liquidity Monopoly vs. Grid India Coupling');
  writeParagraph(
    'CURRENT ARCHITECTURE (IEX Monopoly): [IEX Order Book: 85%+ Liquidity Pool] -> [Proprietary Matching Algorithm] -> [MCP]. Smaller exchanges fail due to thin counterparty depth. FUTURE ARCHITECTURE (Grid India Entry): [IEX Bids + PXIL Bids + HPX Bids] -> [GRID INDIA Central Aggregated Algorithm] -> [Single National Clearing Price]. IEX becomes a standardized bid-collection post and its liquidity moat is socialized.'
  );

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [
      [
        'Auction Stage',
        'Current Architecture (IEX Monopoly)',
        'Future Coupled Regime (Grid India MCO)',
        'Structural Moat Impact',
      ],
    ],
    body: COUPLING_ARCHITECTURE_ROWS.map((r) => [
      cleanPdfText(r.step),
      cleanPdfText(r.standaloneIex),
      cleanPdfText(r.coupledGridIndia),
      cleanPdfText(r.moatImpact),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.1,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      valign: 'top',
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  // ==================== SECTION 3 ====================
  writeSectionHeading('3. 12-Month Operational Growth Drivers vs. Structural Drags');
  writeSubHeading('IRCTC Structural Scaling: Sealed-Window 24-Coach Vande Bharat Sleeper & Amrit Bharat Network');
  writeParagraph(COMPANY_DOSSIERS[1].section3DriversVsDrags, 8.5);

  writeSubHeading('CAMS Compliance Defensive Wall: DPDP Data Clearinghouse & Global Non-Resident KRA');
  writeParagraph(COMPANY_DOSSIERS[0].section3DriversVsDrags, 8.5);

  writeSubHeading('IEX Pivot to Non-Coupled Verticals: 30-Minute RTM, Green Markets, Coupling-Exempt IGX & Carbon');
  writeParagraph(COMPANY_DOSSIERS[2].section3DriversVsDrags, 8.5);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['IEX Vertical / Segment', 'Volume Share', 'Coupling Shield Status', '12-24M Institutional Assessment']],
    body: IEX_PIVOT_SEGMENTS.map((s) => [
      cleanPdfText(s.segment),
      `~${s.shareOfVolume}%`,
      cleanPdfText(s.couplingShieldStatus),
      cleanPdfText(s.strategicRead),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.1,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  // ==================== SECTION 4 ====================
  writeSectionHeading('4. Valuation Multiples & Market Sentiment Disconnect');
  writeParagraph(
    'Equity markets price terminal pricing-power sovereignty rather than trailing margins. Consequently, an insulated commercial duopoly (CAMS, ~38.6x P/E) commands a steep premium over a state-controlled statutory monopoly (IRCTC, ~31.0x P/E) and more than double an endangered liquidity monopoly (IEX, ~17.3x P/E near 52-week lows).'
  );

  // Full Valuation & Financial Comparison Table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [
      [
        'Valuation & Financial Metric',
        'CAMS (Commercial Duopoly)',
        'IRCTC (Sovereign PSU)',
        'IEX (Endangered Liquidity)',
      ],
    ],
    body: [
      [
        'Reference Price & Band',
        cleanPdfText(`${COMPANY_DOSSIERS[0].latestPrice} (${COMPANY_DOSSIERS[0].priceContext})`),
        cleanPdfText(`${COMPANY_DOSSIERS[1].latestPrice} (${COMPANY_DOSSIERS[1].priceContext})`),
        cleanPdfText(`${COMPANY_DOSSIERS[2].latestPrice} (${COMPANY_DOSSIERS[2].priceContext})`),
      ],
      ['Forward P/E Multiple', '~38.6x', '~31.0x', '~17.3x'],
      ['Operating EBITDA Margin', '~46.3%', '~28.2% - 33.5% (Blended)', '~83.5%'],
      ['Net Profit Margin (NPM)', '~32.2%', '~24.1%', '~66.0% (Core Normalized)'],
      ['Return on Capital (ROCE)', '44.8%', '39.4%', '41.2%'],
      ['Balance Sheet Leverage', 'Zero Debt (Net Cash)', 'Zero Debt (Net Cash PSU)', 'Zero Debt (Cash Buffer)'],
      ['Dividend Yield', '~1.45%', '~1.65%', '~3.45%'],
      [
        'Core Pricing Unit',
        '0.02% - 0.05% regressive AUM slabs',
        'INR 15 Non-AC / INR 30 AC + catering',
        'Flat 2p buyer + 2p seller / kWh',
      ],
      [
        'Primary Valuation Driver',
        'B2B switching friction + SIP runway',
        'Legal exclusivity minus PSU policy cap',
        'Grid India coupling fee-war risk',
      ],
    ],
    styles: {
      font: 'helvetica',
      fontSize: 7.6,
      cellPadding: 2.1,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: ZEBRA_FILL,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46 },
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  writeSubHeading('Fund Manager Perspective: The IEX Margin-of-Safety Paradox (~66% NPM, Zero Debt, ~3.45% Yield)');
  writeParagraph(COMPANY_DOSSIERS[2].section4ValuationDisconnect, 8.5);

  // ==================== SECTION 5 ====================
  writeSectionHeading('5. Final Investment Thesis, Capital Allocation & Portfolio Checklist');

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [
      [
        'Priority, Stock & Call',
        'Validation Triggers (12-24M)',
        'Thesis-Breaking / Re-Rating Triggers',
      ],
    ],
    body: COMPANY_DOSSIERS.map((d) => [
      cleanPdfText(`#0${d.rank} ${d.ticker}\nRating: ${d.call}\nWeight: ${d.weightAllocation}`),
      cleanPdfText(d.validatesThesis.map((v) => `* ${v}`).join('\n')),
      cleanPdfText(d.breaksThesis.map((b) => `* ${b}`).join('\n')),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.6,
      cellPadding: 2.3,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      valign: 'top',
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 36 },
      1: { cellWidth: 73 },
      2: { cellWidth: 73 },
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  // Summary Checklist for Portfolio Review
  writeSubHeading('Summary Checklist for Institutional Portfolio Review');
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['Stock & Call', 'Portfolio Archetype', 'Financial Health Checkpoint', 'Primary Watch Metric']],
    body: PORTFOLIO_REVIEW_CHECKLIST.map((item) => [
      cleanPdfText(`${item.ticker} (${item.call})`),
      cleanPdfText(item.archetype),
      cleanPdfText(item.checkpointSummary),
      cleanPdfText(item.primaryWatchMetric),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.1,
      textColor: INK_PRIMARY,
      lineColor: BORDER_GRAY,
      lineWidth: 0.2,
      valign: 'top',
    },
    headStyles: {
      fillColor: HEADER_FILL,
      textColor: INK_PRIMARY,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 28 },
      1: { cellWidth: 34 },
      2: { cellWidth: 74 },
      3: { cellWidth: 46 },
    },
  });
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4.5;

  // Optional Macro & Regulatory Trigger Appendix
  if (includeTriggerAppendix) {
    writeSectionHeading('Appendix: Institutional Macro & Regulatory Trigger Schedule');
    autoTable(doc, {
      startY: cursorY,
      margin: { left: marginX, right: marginX },
      head: [['Stock / Call', 'Policy Domain', 'Horizon', 'Validation Condition', 'Breaker Condition']],
      body: THESIS_TRIGGER_MATRIX.map((t) => [
        cleanPdfText(`${t.ticker} (${t.recommendation})`),
        cleanPdfText(t.domain),
        cleanPdfText(t.horizonWindow),
        cleanPdfText(t.validationCondition),
        cleanPdfText(t.breakerCondition),
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 7.3,
        cellPadding: 2.0,
        textColor: INK_PRIMARY,
        lineColor: BORDER_GRAY,
        lineWidth: 0.2,
        valign: 'top',
      },
      headStyles: {
        fillColor: HEADER_FILL,
        textColor: INK_PRIMARY,
        fontStyle: 'bold',
      },
    });
    cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 4;
  }

  writeParagraph(
    `Tracked Regulatory Statutes: ${SOURCE_BIBLIOGRAPHY.regulatoryFrameworks.join('; ')}.`,
    7.4
  );
  writeParagraph(
    'Institutional Disclaimer: Prepared by Artha Institutional for analytical portfolio evaluation only. Does not constitute personalised investment advice or SEBI-registered advisory. Verify live NSE/BSE prices and primary circulars prior to execution.',
    7.3
  );

  // ==================== PRINTER-FRIENDLY RUNNING HEADERS & FOOTERS ====================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    if (p > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.4);
      doc.setTextColor(...INK_MUTED);
      doc.text('ARTHA INSTITUTIONAL | CAMS vs. IRCTC vs. IEX (12-24M Research Report)', marginX, 11.5);
      doc.setFont('helvetica', 'normal');
      doc.text(cleanPdfText(recipientLabel), pageWidth - marginX, 11.5, { align: 'right' });
      doc.setDrawColor(...BORDER_GRAY);
      doc.setLineWidth(0.2);
      doc.line(marginX, 13.5, pageWidth - marginX, 13.5);
    }

    doc.setDrawColor(...BORDER_GRAY);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 12.5, pageWidth - marginX, pageHeight - 12.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...INK_MUTED);
    doc.text(
      'Artha Institutional Research | Printer-Friendly Institutional PDF Distribution',
      marginX,
      pageHeight - 8
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 8, {
      align: 'right',
    });
  }

  const fileSlug = `artha-institutional-cams-irctc-iex-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileSlug);
  return fileSlug;
}
