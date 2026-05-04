import React from 'react';
import { KpiData } from '../utils/kpi';

interface Props {
  kpi: KpiData;
}

function valClass(v: number, warnThresh: number, alertThresh: number): string {
  if (v > alertThresh) return 'text-[var(--color-red)] font-bold';
  if (v > warnThresh) return 'text-[var(--color-amber)] font-bold';
  return '';
}

const KpiCard: React.FC<{
  label: string; value: number | string; sub: string;
  accentClass?: string; valueClass?: string;
}> = ({ label, value, sub, accentClass, valueClass }) => (
  <div className="py-3 px-[18px] border-r relative" style={{ borderColor: 'var(--color-bdr)' }}>
    {accentClass && (
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentClass}`} />
    )}
    <div className="text-[10px] font-medium tracking-[0.8px] uppercase mb-1"
         style={{ color: 'var(--color-txd)' }}>
      {label}
    </div>
    <div className={`font-serif text-[26px] font-bold leading-none ${valueClass || ''}`}
         style={!valueClass ? { color: 'var(--color-txt)' } : undefined}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-[10px] mt-[3px] font-mono" style={{ color: 'var(--color-txd)' }}>
      {sub}
    </div>
  </div>
);

const KpiRow: React.FC<Props> = ({ kpi }) => (
  <div className="flex-shrink-0 grid grid-cols-7 border-b-2"
       style={{ background: 'var(--color-sur)', borderColor: 'var(--color-bdr)' }}>
    <KpiCard
      label="Total Job Cards"
      value={kpi.total}
      sub="in current view"
      valueClass="text-[var(--color-mol)]"
    />
    <KpiCard
      label="Pending Molding"
      value={kpi.molQ}
      sub={`${kpi.molJ} job card${kpi.molJ !== 1 ? 's' : ''}`}
      accentClass="bg-[var(--color-mol)]"
      valueClass={valClass(kpi.molQ, 100, 500)}
    />
    <KpiCard
      label="Pending Finishing"
      value={kpi.finQ}
      sub={`${kpi.finJ} job card${kpi.finJ !== 1 ? 's' : ''}`}
      accentClass="bg-[var(--color-fin)]"
      valueClass={valClass(kpi.finQ, 100, 300)}
    />
    <KpiCard
      label="Pending Inspection"
      value={kpi.insQ}
      sub={`${kpi.insJ} awaiting QC`}
      accentClass="bg-[var(--color-ins)]"
      valueClass={valClass(kpi.insQ, 50, 200)}
    />
    <KpiCard
      label="Under Rework"
      value={kpi.rwQ}
      sub={`${kpi.rwJ} order${kpi.rwJ !== 1 ? 's' : ''}`}
      accentClass="bg-[var(--color-rw)]"
      valueClass={kpi.rwQ > 0 ? 'text-[var(--color-amber)]' : ''}
    />
    <KpiCard
      label="Rejected"
      value={kpi.rejQ}
      sub={`${kpi.rejJ} order${kpi.rejJ !== 1 ? 's' : ''}`}
      accentClass="bg-[var(--color-rej)]"
      valueClass={kpi.rejQ > 0 ? 'text-[var(--color-red)]' : ''}
    />
    <KpiCard
      label="Ready to Dispatch"
      value={kpi.disQ}
      sub={`${kpi.disJ} order${kpi.disJ !== 1 ? 's' : ''} pending`}
      accentClass="bg-[var(--color-dis)]"
      valueClass={kpi.disQ > 500 ? 'text-[var(--color-red)]' : kpi.disQ > 100 ? 'text-[var(--color-amber)]' : 'text-[var(--color-green)]'}
    />
  </div>
);

export default KpiRow;
