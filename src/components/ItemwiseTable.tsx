import React, { useState, useMemo } from 'react';
import { JobCard, ItemGroup } from '../types';

interface Props { data: JobCard[] }

function numCls(v: number, cls: string): string {
  return v > 0 ? `text-right font-mono text-[12px] ${cls}` : 'text-right font-mono text-[12px] text-[var(--color-txl)]';
}
function pendCls(v: number): string {
  if (v > 100) return 'text-right font-mono text-[12px] text-[var(--color-red)] font-bold';
  if (v > 0) return 'text-right font-mono text-[12px] text-[var(--color-amber)] font-semibold';
  return 'text-right font-mono text-[12px] text-[var(--color-txl)]';
}

const ItemwiseTable: React.FC<Props> = ({ data }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const map: Record<string, ItemGroup> = {};
    data.forEach(r => {
      const key = (r.item || '') + '\0' + (r.die || '-');
      if (!map[key]) {
        map[key] = {
          item: r.item || '—', die: r.die || '-',
          molded: 0, finished: 0, passed: 0, rework: 0, rejected: 0, dispatched: 0, order: 0,
          jcs: {},
        };
      }
      const e = map[key];
      e.molded += r.molded || 0; e.finished += r.finished || 0; e.passed += r.passed || 0;
      e.rework += r.rework || 0; e.rejected += r.rejected || 0; e.dispatched += r.dispatched || 0; e.order += r.order || 0;
      if (!e.jcs[r.jc]) {
        e.jcs[r.jc] = { jc: r.jc, molded: 0, finished: 0, passed: 0, rework: 0, rejected: 0, dispatched: 0, order: 0 };
      }
      const jc = e.jcs[r.jc];
      jc.molded += r.molded || 0; jc.finished += r.finished || 0; jc.passed += r.passed || 0;
      jc.rework += r.rework || 0; jc.rejected += r.rejected || 0; jc.dispatched += r.dispatched || 0; jc.order += r.order || 0;
    });
    return Object.values(map).sort((a, b) => a.item.localeCompare(b.item));
  }, [data]);

  const toggle = (gid: string) => {
    setExpanded(prev => ({ ...prev, [gid]: !prev[gid] }));
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th colSpan={2} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase"
                style={{ background: 'var(--color-ink)', color: '#94a3b8', position: 'sticky', top: 0, zIndex: 10 }}>Item / Die</th>
            <th colSpan={2} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase"
                style={{ background: 'var(--color-ink)', color: '#7bb8d4', position: 'sticky', top: 0, zIndex: 10 }}>Molding</th>
            <th colSpan={2} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase"
                style={{ background: 'var(--color-ink)', color: '#c4a0d4', position: 'sticky', top: 0, zIndex: 10 }}>Finishing</th>
            <th colSpan={3} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase"
                style={{ background: 'var(--color-ink)', color: '#86c4a8', position: 'sticky', top: 0, zIndex: 10 }}>Inspection</th>
            <th colSpan={2} className="text-left py-1 px-3 text-[8px] font-semibold tracking-[1px] uppercase"
                style={{ background: 'var(--color-ink)', color: '#f0c080', position: 'sticky', top: 0, zIndex: 10 }}>Dispatch</th>
          </tr>
          <tr>
            {['Item Name','Die No.'].map(h =>
              <th key={h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                  style={{ background: 'var(--color-sur2)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
            )}
            {['Total Molded','Pending'].map(h =>
              <th key={'m'+h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                  style={{ background: 'rgba(29,111,164,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
            )}
            {['Total Finished','Pending'].map(h =>
              <th key={'f'+h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                  style={{ background: 'rgba(124,61,140,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
            )}
            {['QC Passed','Rework','Rejected'].map((h, i) =>
              <th key={'i'+h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                  style={{ background: i > 0 ? 'rgba(185,28,28,0.04)' : 'rgba(26,107,74,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
            )}
            {['Dispatched','Pending'].map(h =>
              <th key={'d'+h} className="text-left py-1.5 px-3 text-[9px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2"
                  style={{ background: 'rgba(180,83,9,0.04)', color: 'var(--color-txd)', borderColor: 'var(--color-bdr2)', position: 'sticky', top: 24, zIndex: 10 }}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr><td colSpan={11} className="text-center py-12 italic text-[12px]" style={{ color: 'var(--color-txd)' }}>No items match your filters.</td></tr>
          ) : groups.map((g, idx) => {
            const gid = 'g' + idx;
            const isOpen = !!expanded[gid];
            const pM = Math.max(0, g.order - g.molded);
            const pF = Math.max(0, g.molded - g.finished);
            const pD = Math.max(0, g.passed - g.dispatched);
            const jcList = Object.values(g.jcs);

            return (
              <React.Fragment key={gid}>
                <tr className={`border-b cursor-pointer hover:bg-[#f0efea] transition-colors ${isOpen ? 'bg-[#f0eeeb]' : ''}`}
                    style={{ borderColor: 'var(--color-bdr)' }}
                    onClick={() => toggle(gid)}>
                  <td className="py-2 px-3 whitespace-nowrap font-semibold text-[12px]" style={{ color: 'var(--color-ink)' }}>
                    <span className={`expbtn ${isOpen ? 'open' : ''}`}>▶</span>
                    {g.item}
                    <span className="text-[10px] font-normal ml-1.5" style={{ color: 'var(--color-txd)' }}>
                      {jcList.length} JC{jcList.length > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] font-medium whitespace-nowrap" style={{ color: 'var(--color-txt)' }}>{g.die}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.molded, 'text-[var(--color-mol)]')}`}>{g.molded > 0 ? g.molded.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pM)}`}>{pM > 0 ? pM.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.finished, 'text-[var(--color-fin)]')}`}>{g.finished > 0 ? g.finished.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pF)}`}>{pF > 0 ? pF.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.passed, 'text-[var(--color-ins)]')}`}>{g.passed > 0 ? g.passed.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.rework, 'text-[var(--color-rw)]')}`}>{g.rework > 0 ? g.rework.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.rejected, 'text-[var(--color-red)] font-bold')}`}>{g.rejected > 0 ? g.rejected.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${numCls(g.dispatched, 'text-[var(--color-dis)]')}`}>{g.dispatched > 0 ? g.dispatched.toLocaleString() : '—'}</td>
                  <td className={`py-2 px-3 whitespace-nowrap ${pendCls(pD)}`}>{pD > 0 ? pD.toLocaleString() : '—'}</td>
                </tr>
                {isOpen && jcList.map(jc => {
                  const jpM = Math.max(0, jc.order - jc.molded);
                  const jpF = Math.max(0, jc.molded - jc.finished);
                  const jpD = Math.max(0, jc.passed - jc.dispatched);
                  return (
                    <tr key={jc.jc} className="border-b cursor-default hover:bg-[#f3f2ee]"
                        style={{ borderColor: 'var(--color-bdr)', background: '#fafaf7' }}>
                      <td className="py-1.5 pl-9 pr-3 text-[11px]" style={{ color: 'var(--color-txm)' }}>
                        ↳ <span className="font-serif font-semibold" style={{ color: 'var(--color-ink)' }}>{jc.jc}</span>
                      </td>
                      <td className="py-1.5 px-3 text-[10px]" style={{ color: 'var(--color-txl)' }}>—</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.molded, 'text-[var(--color-mol)]')}`}>{jc.molded > 0 ? jc.molded.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${pendCls(jpM)}`}>{jpM > 0 ? jpM.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.finished, 'text-[var(--color-fin)]')}`}>{jc.finished > 0 ? jc.finished.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${pendCls(jpF)}`}>{jpF > 0 ? jpF.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.passed, 'text-[var(--color-ins)]')}`}>{jc.passed > 0 ? jc.passed.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.rework, 'text-[var(--color-rw)]')}`}>{jc.rework > 0 ? jc.rework.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.rejected, 'text-[var(--color-red)] font-bold')}`}>{jc.rejected > 0 ? jc.rejected.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${numCls(jc.dispatched, 'text-[var(--color-dis)]')}`}>{jc.dispatched > 0 ? jc.dispatched.toLocaleString() : '—'}</td>
                      <td className={`py-1.5 px-3 whitespace-nowrap text-[11px] ${pendCls(jpD)}`}>{jpD > 0 ? jpD.toLocaleString() : '—'}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemwiseTable;
