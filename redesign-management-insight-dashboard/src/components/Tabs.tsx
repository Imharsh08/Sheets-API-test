import React from 'react';
import { TabName } from '../types';

interface Props {
  active: TabName;
  onChange: (tab: TabName) => void;
}

const tabs: { key: TabName; label: string }[] = [
  { key: 'unified', label: 'All Stages — One View' },
  { key: 'pending', label: 'Pending Pipeline' },
  { key: 'itemwise', label: 'Item & Die Output' },
];

const Tabs: React.FC<Props> = ({ active, onChange }) => (
  <div className="no-print flex-shrink-0 flex items-center px-5 h-[38px] gap-0 border-b"
       style={{ background: 'var(--color-sur)', borderColor: 'var(--color-bdr)' }}>
    {tabs.map(t => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`px-[18px] h-[38px] flex items-center text-[11px] font-semibold tracking-[0.8px] uppercase whitespace-nowrap cursor-pointer border-b-2 transition-all ${
          active === t.key
            ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
            : 'border-transparent text-[var(--color-txm)] hover:text-[var(--color-txt)]'
        }`}
        style={{ background: 'transparent' }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export default Tabs;
