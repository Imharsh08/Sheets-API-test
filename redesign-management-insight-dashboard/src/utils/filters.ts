import { JobCard, FocusFilter } from '../types';

interface FilterOptions {
  search: string;
  die: string;
  mat: string;
  focus: FocusFilter;
  dateFrom: string;
  dateTo: string;
}

export function filterData(data: JobCard[], opts: FilterOptions): JobCard[] {
  const s = opts.search.toLowerCase();
  const dFrom = opts.dateFrom ? new Date(opts.dateFrom + 'T00:00:00') : null;
  const dTo = opts.dateTo ? new Date(opts.dateTo + 'T23:59:59') : null;

  return data.filter(r => {
    if (s) {
      const idx = ((r.jc || '') + '\0' + (r.item || '') + '\0' + (r.die || '')).toLowerCase();
      if (idx.indexOf(s) === -1) return false;
    }
    if (opts.die && r.die !== opts.die) return false;
    if (opts.mat && !(r.item || '').includes(opts.mat)) return false;

    if (dFrom || dTo) {
      if (!r.activityDate) return false;
      const [y, m, d] = r.activityDate.split('-');
      const rd = new Date(+y, +m - 1, +d);
      if (dFrom && rd < dFrom) return false;
      if (dTo && rd > dTo) return false;
    }

    const pM = Math.max(0, (r.order || 0) - (r.molded || 0));
    const pF = Math.max(0, (r.molded || 0) - (r.finished || 0));
    const pI = Math.max(0, (r.finished || 0) - (r.passed || 0));
    const pD = Math.max(0, (r.passed || 0) - (r.dispatched || 0));
    const isBot = pM > 100 || pF > 100 || pI > 100 || pD > 100 || (r.rejected || 0) > 0;
    const hasPend = pM > 0 || pF > 0 || pI > 0 || pD > 0;
    const hasDef = (r.rework || 0) > 0 || (r.rejected || 0) > 0;

    if (opts.focus === 'bottleneck' && !isBot) return false;
    if (opts.focus === 'pend' && !hasPend) return false;
    if (opts.focus === 'defect' && !hasDef) return false;

    return true;
  });
}

export function getUniqueDies(data: JobCard[]): string[] {
  const s = new Set<string>();
  data.forEach(r => { if (r.die && r.die !== '-') s.add(r.die); });
  return [...s].sort();
}

export function getUniqueMaterials(data: JobCard[]): string[] {
  const s = new Set<string>();
  data.forEach(r => {
    if (r.item) {
      const parts = r.item.split('_');
      if (parts.length > 1) s.add(parts[parts.length - 1]);
    }
  });
  return [...s].sort();
}
