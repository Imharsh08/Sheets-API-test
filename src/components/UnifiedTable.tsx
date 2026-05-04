import React from 'react';
import { JobCard } from '../types';

interface Props { data: JobCard[] }

function numCls(v: number, cls: string): string {
  return v > 0 ? `text-right font-mono text-[12px] ${cls}` : 'text-right font-mono text-[12px] text-[var(--color-txl)]';
}

function pendCls(v: number): string {
  if (v > 100) return 'text-right font-mono text-[12px] text-[var(--color-red)] font-bold';
  if (v > 0) return 'text-right font-mono text-[12px] text-[var(--color-amber)] font-semibold';
  return 'text-right font-mono text-[12px] text-[var(--color-txl)]';
}

function pbar(pct: number, col: string) {
  return (
    <div className="pbar-wrap">
      <div className="pbar" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
}

function bottleneckBadge(r: JobCard) {
  const pM = Math.max(0, r.order - r.molded);
  const pF = Math.max(0, r.molded - r.finished);
  const pI = Math.max(0, r.finished - r.passed);
  const pD = Math.max(0, r.passed - r.dispatched);

  if (r.rejected > 0) return <span className="badge badge-red">Rejects</span>;
  if (pM > 100) return <span className="badge badge-amber">Molding</span>;
  if (pF > 100) return <span className="badge badge-neutral">Finishing</span>;
  if (pI > 100) return <span className="badge badge-blue">Inspection</span>;
  if (r.rework > 0) return <span className="badge badge-amber">Rework</span>;
  if (pD > 0) return <span className="badge badge-green">Ready</span>;
  return <span style={{ color: 'var(--color-txl)', fontSize: 11 }}>—</span>;
}

const UnifiedTable: React.FC<Props> = ({ data }) => (
  <div className="flex-1 overflow-auto" id="view-unified">
    <table className="w-full border-collapse min-w-[1100px]">
      <thead>
        <tr>
          <th colSpan={4} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#94a3b8', position: 'sticky', top: 0, zIndex: 10 }}>Job Card</th>
          <th colSpan={3} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#7bb8d4', position: 'sticky', top: 0, zIndex: 10 }}>Molding Stage</th>
          <th colSpan={3} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#c4a0d4', position: 'sticky', top: 0, zIndex: 10 }}>Finishing Stage</th>
          <th colSpan={4} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#86c4a8', position: 'sticky', top: 0, zIndex: 10 }}>Inspection &amp; QC</th>
          <th colSpan={3} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#f0c080', position: 'sticky', top: 0, zIndex: 10 }}>Dispatch</th>
          <th colSpan={1} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-0"
              style={{ background: 'var(--color-ink)', color: '#f0a080', position: 'sticky', top: 0, zIndex: 10 }}>Status</th>
        </tr>
        <tr>
          {['Die','Job Card No.','Item / Material','Order Qty'].map(h =>
            <th key={h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                style={{ background: 'var(--color-sur2)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
          )}
          {['Molded','Still to Mold','Progress'].map(h =>
            <th key={h} className="bg-mol text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                style={{ background: 'rgba(29,111,164,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
          )}
          {['Finished','Still to Finish','Progress'].map(h =>
            <th key={h} className="bg-fin text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                style={{ background: 'rgba(124,61,140,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
          )}
          {['Passed QC','Rework','Rejected','Still to Inspect'].map((h,i) =>
            <th key={h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                style={{ background: i >= 1 && i <= 2 ? 'rgba(185,28,28,0.04)' : 'rgba(26,107,74,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
          )}
          {['Dispatched','Still to Dispatch','Progress'].map(h =>
            <th key={h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                style={{ background: 'rgba(180,83,9,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
          )}
          <th className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
              style={{ background: 'var(--color-sur2)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>Bottleneck</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={18} className="text-center py-12 italic text-[12px]" style={{ color: 'var(--color-txd)' }}>No orders match your filters.</td></tr>
        ) : data.map(r => {
          const o = r.order || 0, mo = r.molded || 0, fi = r.finished || 0;
          const pa = r.passed || 0, di = r.dispatched || 0;
          const pM = Math.max(0, o - mo), pF = Math.max(0, mo - fi);
          const pI = Math.max(0, fi - pa), pD = Math.max(0, pa - di);
          const molPct = o > 0 ? Math.min(100, Math.round(mo / o * 100)) : 0;
          const finPct = mo > 0 ? Math.min(100, Math.round(fi / mo * 100)) : 0;
          const disPct = pa > 0 ? Math.min(100, Math.round(di / pa * 100)) : 0;

          return (
            <tr key={r.jc} className="border-b hover:bg-[#f0efea] transition-colors"
                style={{ borderColor: 'var(--color-bdr)' }}>
              <td className="py-2 px-3 font-mono text-[11px] font-medium whitespace-nowrap" style={{ color: 'var(--color-txt)' }}>{r.die || '—'}</td>
              <td className="py-2 px-3 font-serif text-[14px] font-bold whitespace-nowrap" style={{ color: 'var(--color-ink)' }}>{r.jc || '—'}</td>
              <td className="py-2 px-3 text-[11px] max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap" title={r.item} style={{ color: 'var(--color-txm)' }}>{r.item || '—'}</td>
              <td className="py-2 px-3 text-right font-mono text-[12px] font-semibold whitespace-nowrap" style={{ color: 'var(--color-txt)' }}>{o > 0 ? o.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(mo, 'text-[var(--color-mol)]')}`}>{mo > 0 ? mo.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pM)}`}>{pM > 0 ? pM.toLocaleString() : '—'}</td>
              <td className="py-2 px-3 whitespace-nowrap bg-mol">{pbar(molPct, 'var(--color-mol)')}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(fi, 'text-[var(--color-fin)]')}`}>{fi > 0 ? fi.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pF)}`}>{pF > 0 ? pF.toLocaleString() : '—'}</td>
              <td className="py-2 px-3 whitespace-nowrap bg-fin">{pbar(finPct, 'var(--color-fin)')}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(pa, 'text-[var(--color-ins)]')}`}>{pa > 0 ? pa.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(r.rework, 'text-[var(--color-rw)]')}`}>{r.rework > 0 ? r.rework.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(r.rejected, 'text-[var(--color-red)] font-bold')}`}>{r.rejected > 0 ? r.rejected.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pI)}`}>{pI > 0 ? pI.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${numCls(di, 'text-[var(--color-dis)]')}`}>{di > 0 ? di.toLocaleString() : '—'}</td>
              <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pD)}`}>{pD > 0 ? pD.toLocaleString() : '—'}</td>
              <td className="py-2 px-3 whitespace-nowrap bg-dis">{pbar(disPct, 'var(--color-dis)')}</td>
              <td className="py-2 px-3 whitespace-nowrap">{bottleneckBadge(r)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default UnifiedTable;
