import { JobCard } from '../types';

export interface KpiData {
  total: number;
  molQ: number; molJ: number;
  finQ: number; finJ: number;
  insQ: number; insJ: number;
  rwQ: number; rwJ: number;
  rejQ: number; rejJ: number;
  disQ: number; disJ: number;
}

export function computeKpi(data: JobCard[]): KpiData {
  let molQ = 0, molJ = 0, finQ = 0, finJ = 0, insQ = 0, insJ = 0;
  let rwQ = 0, rwJ = 0, rejQ = 0, rejJ = 0, disQ = 0, disJ = 0;

  data.forEach(r => {
    const pM = Math.max(0, (r.order || 0) - (r.molded || 0));
    const pF = Math.max(0, (r.molded || 0) - (r.finished || 0));
    const pI = Math.max(0, (r.finished || 0) - (r.passed || 0));
    const pD = Math.max(0, (r.passed || 0) - (r.dispatched || 0));
    if (pM) { molQ += pM; molJ++; }
    if (pF) { finQ += pF; finJ++; }
    if (pI) { insQ += pI; insJ++; }
    if (r.rework) { rwQ += r.rework; rwJ++; }
    if (r.rejected) { rejQ += r.rejected; rejJ++; }
    if (pD) { disQ += pD; disJ++; }
  });

  return { total: data.length, molQ, molJ, finQ, finJ, insQ, insJ, rwQ, rwJ, rejQ, rejJ, disQ, disJ };
}
