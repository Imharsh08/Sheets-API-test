import { JobCard } from '../types';

const STORAGE_KEY = 'mrt_sheets_url';

export function getSavedUrl(): string {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveUrl(url: string) {
  localStorage.setItem(STORAGE_KEY, url);
}

export function clearUrl() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Fetches data from a Google Apps Script Web App endpoint.
 *
 * Your Apps Script should:
 *  1. Be deployed as a Web App (Execute as: Me, Access: Anyone)
 *  2. Have a doGet() function that returns JSON like:
 *
 *     function doGet() {
 *       var data = getSheetData(); // your existing function
 *       return ContentService
 *         .createTextOutput(JSON.stringify(data))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *
 *  The JSON should be an array of objects with keys:
 *    jc, item, die, order, molded, finished, passed, rework, rejected, dispatched, activityDate
 */
export async function fetchSheetData(url: string): Promise<JobCard[]> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();

  if (!Array.isArray(data)) {
    throw new Error('Response is not an array. Make sure your Apps Script returns a JSON array.');
  }

  return data.map((r: Record<string, unknown>) => ({
    jc: String(r.jc || r.JC || r.jobCard || r.job_card || ''),
    item: String(r.item || r.Item || r.itemName || r.item_name || ''),
    die: String(r.die || r.Die || r.dieNo || r.die_no || '-'),
    order: Number(r.order || r.Order || r.orderQty || r.order_qty || 0),
    molded: Number(r.molded || r.Molded || r.moulded || 0),
    finished: Number(r.finished || r.Finished || 0),
    passed: Number(r.passed || r.Passed || r.qcPassed || 0),
    rework: Number(r.rework || r.Rework || 0),
    rejected: Number(r.rejected || r.Rejected || 0),
    dispatched: Math.min(
      Number(r.dispatched || r.Dispatched || 0),
      Number(r.order || r.Order || r.orderQty || r.order_qty || 0)
    ),
    activityDate: String(r.activityDate || r.activity_date || r.date || ''),
  }));
}
