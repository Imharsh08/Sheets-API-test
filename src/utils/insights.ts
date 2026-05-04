import { JobCard, InsightChip } from '../types';

export function buildInsights(data: JobCard[]): InsightChip[] {
  const chips: InsightChip[] = [];
  let totalMolPend = 0, totalFinPend = 0, totalInsPend = 0, totalDisPend = 0;
  let totalRW = 0, totalRej = 0;
  const molBotJcs: string[] = [], finBotJcs: string[] = [], insBotJcs: string[] = [], disBotJcs: string[] = [];
  const rejJcs: { jc: string; rej: number; item: string }[] = [];
  let totalOrder = 0, totalDispatched = 0;
  const nearComplete: string[] = [];

  data.forEach(r => {
    const o = r.order || 0;
    const mo = r.molded || 0, fi = r.finished || 0;
    const pa = r.passed || 0, di = r.dispatched || 0;
    const rw = r.rework || 0, re = r.rejected || 0;

    const pM = Math.max(0, o - mo);
    const pF = Math.max(0, mo - fi);
    const pI = Math.max(0, fi - pa);
    const pD = Math.max(0, pa - di);

    totalMolPend += pM; totalFinPend += pF;
    totalInsPend += pI; totalDisPend += pD;
    totalRW += rw; totalRej += re;
    totalOrder += o; totalDispatched += di;

    if (pM > 100) molBotJcs.push(r.jc);
    if (pF > 100) finBotJcs.push(r.jc);
    if (pI > 100) insBotJcs.push(r.jc);
    if (pD > 100) disBotJcs.push(r.jc);
    if (re > 0) rejJcs.push({ jc: r.jc, rej: re, item: r.item });

    if (o > 0 && pD > 0 && pD <= Math.ceil(o * 0.1)) nearComplete.push(r.jc);
  });

  const totalJcs = data.length;
  const dispatchPct = totalOrder > 0 ? Math.round(totalDispatched / totalOrder * 100) : 0;

  const totalBottlenecks = molBotJcs.length + finBotJcs.length + insBotJcs.length + disBotJcs.length;

  if (totalBottlenecks === 0 && totalRej === 0) {
    chips.push({
      cls: 'chip-ok', ico: '✓',
      msg: `Production is flowing cleanly — no major bottlenecks or quality issues detected across all ${totalJcs} job cards.`
    });
  } else {
    chips.push({
      cls: 'chip-neutral', ico: '📋',
      msg: `${totalJcs} job card${totalJcs !== 1 ? 's' : ''} tracked. Overall dispatch completion stands at ${dispatchPct}% of total ordered quantity.`
    });
  }

  if (molBotJcs.length > 0) {
    const shown = molBotJcs.slice(0, 3).join(', ');
    chips.push({
      cls: 'chip-warn', ico: '⚠️',
      msg: `Molding is lagging on ${molBotJcs.length} order${molBotJcs.length > 1 ? 's' : ''} (${shown}${molBotJcs.length > 3 ? ' and more' : ''}) with over 100 pieces still unmolded. Consider shifting press capacity.`
    });
  }

  if (finBotJcs.length > 0) {
    const shown = finBotJcs.slice(0, 3).join(', ');
    chips.push({
      cls: 'chip-warn', ico: '⚠️',
      msg: `Finishing is a queue constraint on ${finBotJcs.length} order${finBotJcs.length > 1 ? 's' : ''} (${shown}). Molded stock is waiting — assign more finishing capacity to unblock.`
    });
  }

  if (insBotJcs.length > 0) {
    chips.push({
      cls: 'chip-info', ico: '🔍',
      msg: `QC inspection is pending for more than 100 pieces on ${insBotJcs.length} order${insBotJcs.length > 1 ? 's' : ''}. Finished goods are ready — inspection is the constraint to clear before dispatch.`
    });
  }

  if (disBotJcs.length > 0) {
    chips.push({
      cls: 'chip-info', ico: '📦',
      msg: `${disBotJcs.length} order${disBotJcs.length > 1 ? 's are' : ' is'} cleared by QC with large quantities waiting to be dispatched. Coordinate with logistics to ship these out.`
    });
  }

  if (totalRej > 0) {
    const topRej = [...rejJcs].sort((a, b) => b.rej - a.rej).slice(0, 2);
    const topStr = topRej.map(r => `${r.jc} (${r.rej} pcs)`).join(', ');
    chips.push({
      cls: 'chip-alert', ico: '🔴',
      msg: `${totalRej} piece${totalRej > 1 ? 's have' : ' has'} been rejected across ${rejJcs.length} order${rejJcs.length > 1 ? 's' : ''}. Highest on ${topStr}. Investigate the root cause to prevent further losses.`
    });
  }

  if (totalRW > 0 && totalRej === 0) {
    chips.push({
      cls: 'chip-warn', ico: '🔧',
      msg: `${totalRW} piece${totalRW > 1 ? 's are' : ' is'} under rework. Monitor closely — rework delays downstream finishing and dispatch schedules.`
    });
  } else if (totalRW > 0) {
    chips.push({
      cls: 'chip-warn', ico: '🔧',
      msg: `An additional ${totalRW} piece${totalRW > 1 ? 's are' : ' is'} under rework on top of the rejects.`
    });
  }

  if (nearComplete.length > 0) {
    chips.push({
      cls: 'chip-ok', ico: '🏁',
      msg: `${nearComplete.length} order${nearComplete.length > 1 ? 's are' : ' is'} nearly complete — less than 10% of pieces remain to dispatch. Prioritise these for closure: ${nearComplete.slice(0, 4).join(', ')}${nearComplete.length > 4 ? '…' : ''}.`
    });
  }

  if (totalRej === 0 && totalRW === 0 && totalBottlenecks > 0) {
    chips.push({
      cls: 'chip-ok', ico: '✓',
      msg: 'No quality rejections or rework recorded — quality control is holding strong.'
    });
  }

  // Suppress lint for unused vars
  void totalMolPend; void totalFinPend; void totalInsPend; void totalDisPend;

  return chips;
}
