import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISCO_PITC_PATHS: Record<string, { pitcSlug: string; officialPortal: string }> = {
  LESCO: {
    pitcSlug: 'lescobill',
    officialPortal: 'http://www.lesco.gov.pk:36269/Modules/CustomerBill/CheckBill.asp'
  },
  MEPCO: {
    pitcSlug: 'mepcobill',
    officialPortal: 'https://bill.pitc.com.pk/mepcobill'
  },
  FESCO: {
    pitcSlug: 'fescobill',
    officialPortal: 'https://bill.pitc.com.pk/fescobill'
  },
  IESCO: {
    pitcSlug: 'iescobill',
    officialPortal: 'https://bill.pitc.com.pk/iescobill'
  },
  GEPCO: {
    pitcSlug: 'gepcobill',
    officialPortal: 'https://bill.pitc.com.pk/gepcobill'
  },
  PESCO: {
    pitcSlug: 'pescobill',
    officialPortal: 'https://bill.pitc.com.pk/pescobill'
  },
  HESCO: {
    pitcSlug: 'hescobill',
    officialPortal: 'https://bill.pitc.com.pk/hescobill'
  },
  SEPCO: {
    pitcSlug: 'sepcobill',
    officialPortal: 'https://bill.pitc.com.pk/sepcobill'
  },
  QESCO: {
    pitcSlug: 'qescobill',
    officialPortal: 'https://bill.pitc.com.pk/qescobill'
  },
  TESCO: {
    pitcSlug: 'tescobill',
    officialPortal: 'https://bill.pitc.com.pk/tescobill'
  }
};

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumber(val: string | undefined, fallback: number): number {
  if (!val) return fallback;
  const cleaned = val.replace(/[^0-9.-]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function parsePitcBillHtml(html: string) {
  const text = stripTags(html);
  // Check if the HTML actually contains a valid PITC consumer bill
  const hasBillContent =
    /REFERENCE\s*NO|CONSUMER\s*ID|CUSTOMER\s*ID|PAYABLE\s*WITHIN\s*DUE\s*DATE/i.test(text) &&
    !/Record\s*not\s*found|Invalid\s*Reference|Server\s*Error/i.test(text);

  if (!hasBillContent) {
    return null;
  }

  const refMatch = text.match(/\b(\d{2}\s*\d{5}\s*\d{7})\b/);
  const custIdMatch = text.match(/CUSTOMER\s*ID\s*[:\-]?\s*(\d{10})/i) || text.match(/\b(\d{10})\b/);
  const payableMatch =
    text.match(/PAYABLE\s*WITHIN\s*DUE\s*DATE[\s\S]{0,60}?([0-9,]{3,9})/i) ||
    text.match(/Current\s*Bill[\s\S]{0,30}?([0-9,]{3,9})/i);
  const afterDueMatch =
    text.match(/PAYABLE\s*AFTER\s*DUE\s*DATE[\s\S]{0,60}?([0-9,]{3,9})/i);
  const dueDateMatch =
    text.match(/DUE\s*DATE[\s\S]{0,40}?(\d{1,2}\s+[A-Z]{3}\s+\d{2,4}|\d{2}[-/][A-Z]{3}[-/]\d{2,4})/i);
  const issueDateMatch =
    text.match(/ISSUE\s*DATE[\s\S]{0,40}?(\d{1,2}\s+[A-Z]{3}\s+\d{2,4}|\d{2}[-/][A-Z]{3}[-/]\d{2,4})/i);
  const readingDateMatch =
    text.match(/READING\s*DATE[\s\S]{0,40}?(\d{1,2}\s+[A-Z]{3}\s+\d{2,4}|\d{2}[-/][A-Z]{3}[-/]\d{2,4})/i);
  const billMonthMatch =
    text.match(/BILL\s*MONTH[\s\S]{0,30}?([A-Z]{3}\s*\d{2,4})/i);
  const unitsMatch =
    text.match(/UNITS(?:\s*CONSUMED)?[\s\S]{0,40}?(\d{1,5})\b/i);
  const tariffMatch =
    text.match(/TARIFF[\s\S]{0,30}?([A-Z]-\d[A-Z]?\(\d{2}\))/i);

  // Extract Name & Address block if present
  const nameAddressMatch = text.match(/NAME\s*&\s*ADDRESS\s*(.*?)(?:TRANSFORMER|FEEDER|SUB\s*DIVISION|METER\s*NO)/i);
  let consumerName: string | undefined;
  let address: string | undefined;
  if (nameAddressMatch && nameAddressMatch[1]) {
    const rawBlock = nameAddressMatch[1].replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
    const parts = rawBlock.split(',');
    if (parts.length >= 1 && parts[0].trim().length > 2) {
      consumerName = parts[0].trim();
      address = parts.slice(1).join(',').trim() || rawBlock;
    }
  }

  // Extract 12-month history if present in PITC table (e.g. JAN26, FEB26, etc.)
  const monthRegex = /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*\d{2}\s+(\d{2,6})\s+(\d{1,5})\b/gi;
  const usageHistory: { month: string; units: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = monthRegex.exec(text)) !== null) {
    usageHistory.push({
      month: m[1].toUpperCase(),
      units: Number(m[3])
    });
  }

  return {
    referenceNo: refMatch ? refMatch[1].replace(/\s+/g, '') : undefined,
    customerId: custIdMatch ? custIdMatch[1] : undefined,
    consumerName,
    address,
    billMonth: billMonthMatch ? billMonthMatch[1].toUpperCase() : undefined,
    issueDate: issueDateMatch ? issueDateMatch[1].toUpperCase() : undefined,
    readingDate: readingDateMatch ? readingDateMatch[1].toUpperCase() : undefined,
    dueDate: dueDateMatch ? dueDateMatch[1].toUpperCase() : undefined,
    unitsConsumed: unitsMatch ? parseNumber(unitsMatch[1], 0) : undefined,
    tariff: tariffMatch ? tariffMatch[1] : undefined,
    payableWithinDue: payableMatch ? parseNumber(payableMatch[1], 0) : undefined,
    payableAfterDue: afterDueMatch ? parseNumber(afterDueMatch[1], 0) : undefined,
    usageHistory: usageHistory.length >= 6 ? usageHistory.slice(-12) : undefined
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint: Fetch Bill from the Selected Electricity Company's Official Website (PITC / DISCO server)
  app.get('/api/bill', async (req, res) => {
    const discoRaw = String(req.query.disco || 'MEPCO').toUpperCase();
    const rawInput = String(req.query.ref || '').replace(/[^0-9]/g, '');
    const mode = String(req.query.mode || 'reference') === 'customerId' ? 'customerId' : 'reference';

    const discoConfig = DISCO_PITC_PATHS[discoRaw] || DISCO_PITC_PATHS.MEPCO;
    const queryParam = mode === 'customerId' ? `appno=${rawInput}` : `refno=${rawInput}`;
    const targetUrl = `https://bill.pitc.com.pk/${discoConfig.pitcSlug}/general?${queryParam}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: `https://bill.pitc.com.pk/${discoConfig.pitcSlug}`
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        const parsed = parsePitcBillHtml(html);

        if (parsed) {
          res.json({
            ok: true,
            source: 'live-company-website',
            disco: discoRaw,
            companyBillUrl: targetUrl,
            officialPortal: discoConfig.officialPortal,
            parsed
          });
          return;
        }
      }

      res.json({
        ok: true,
        source: 'company-endpoint-fallback',
        disco: discoRaw,
        companyBillUrl: targetUrl,
        officialPortal: discoConfig.officialPortal,
        parsed: null
      });
    } catch {
      res.json({
        ok: true,
        source: 'company-endpoint-fallback',
        disco: discoRaw,
        companyBillUrl: targetUrl,
        officialPortal: discoConfig.officialPortal,
        parsed: null
      });
    }
  });

  // Optional raw HTML proxy for viewing the live PITC page directly if available
  app.get('/api/bill/official-html', async (req, res) => {
    const discoRaw = String(req.query.disco || 'MEPCO').toUpperCase();
    const rawInput = String(req.query.ref || '').replace(/[^0-9]/g, '');
    const mode = String(req.query.mode || 'reference') === 'customerId' ? 'customerId' : 'reference';

    const discoConfig = DISCO_PITC_PATHS[discoRaw] || DISCO_PITC_PATHS.MEPCO;
    const queryParam = mode === 'customerId' ? `appno=${rawInput}` : `refno=${rawInput}`;
    const targetUrl = `https://bill.pitc.com.pk/${discoConfig.pitcSlug}/general?${queryParam}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        let html = await response.text();
        html = html.replace(
          /<head>/i,
          `<head><base href="https://bill.pitc.com.pk/${discoConfig.pitcSlug}/" />`
        );
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
        return;
      }
      res.redirect(targetUrl);
    } catch {
      res.redirect(targetUrl);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BijliPK server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
