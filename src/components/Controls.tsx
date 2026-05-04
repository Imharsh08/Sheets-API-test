import React from 'react';
import { FocusFilter } from '../types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  dies: string[];
  die: string;
  onDie: (v: string) => void;
  materials: string[];
  mat: string;
  onMat: (v: string) => void;
  dateFrom: string;
  onDateFrom: (v: string) => void;
  dateTo: string;
  onDateTo: (v: string) => void;
  focus: FocusFilter;
  onFocus: (v: FocusFilter) => void;
  filteredCount: number;
  totalCount: number;
  hasFilter: boolean;
}

const Controls: React.FC<Props> = ({
  search, onSearch, dies, die, onDie, materials, mat, onMat,
  dateFrom, onDateFrom, dateTo, onDateTo, focus, onFocus,
  filteredCount, totalCount, hasFilter,
}) => {
  const inputCls = `bg-[var(--color-sur)] border border-[var(--color-bdr2)] rounded-[5px] px-2.5 text-[var(--color-txt)] font-sans text-[12px] outline-none h-7 focus:border-[var(--color-ink2)] focus:shadow-[0_0_0_2px_rgba(45,66,112,0.1)]`;
  const selCls = `bg-[var(--color-sur)] border border-[var(--color-bdr2)] rounded-[5px] px-2 text-[var(--color-txt)] font-sans text-[12px] outline-none cursor-pointer h-7 focus:border-[var(--color-ink2)]`;
  const lblCls = `text-[9px] font-semibold tracking-[1px] uppercase` ;

  return (
    <div className="no-print flex-shrink-0 border-b px-5 py-2 flex items-center gap-2.5 flex-wrap"
         style={{ background: 'var(--color-sur2)', borderColor: 'var(--color-bdr)' }}>
      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Quick Search</label>
        <input
          className={`${inputCls} w-[200px] ${search ? 'border-[var(--color-amber)]! bg-[var(--color-amber-bg)]!' : ''}`}
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Job card or item name…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {hasFilter && (
        <span className="font-mono text-[10px] min-w-[56px] mt-3.5"
              style={{ color: 'var(--color-txd)' }}>
          {filteredCount}/{totalCount} orders
        </span>
      )}

      <div className="w-px h-7 mt-3.5" style={{ background: 'var(--color-bdr2)' }} />

      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Die Number</label>
        <select className={selCls} value={die} onChange={e => onDie(e.target.value)}>
          <option value="">All Dies</option>
          {dies.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Material</label>
        <select className={selCls} value={mat} onChange={e => onMat(e.target.value)}>
          <option value="">All Materials</option>
          {materials.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="w-px h-7 mt-3.5" style={{ background: 'var(--color-bdr2)' }} />

      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Activity From</label>
        <input className={inputCls} type="date" value={dateFrom} onChange={e => onDateFrom(e.target.value)} />
      </div>
      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Activity To</label>
        <input className={inputCls} type="date" value={dateTo} onChange={e => onDateTo(e.target.value)} />
      </div>

      <div className="w-px h-7 mt-3.5" style={{ background: 'var(--color-bdr2)' }} />

      <div className="flex flex-col gap-0.5">
        <label className={lblCls} style={{ color: 'var(--color-txd)' }}>Focus</label>
        <select className={selCls} value={focus} onChange={e => onFocus(e.target.value as FocusFilter)}>
          <option value="">All Orders</option>
          <option value="bottleneck">Bottlenecks Only</option>
          <option value="pend">Has Pending Work</option>
          <option value="defect">Has Rework / Rejects</option>
        </select>
      </div>
    </div>
  );
};

export default Controls;
