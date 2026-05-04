import React from 'react';

interface Props {
  syncTime: string;
  isDemo: boolean;
  onOpenSettings: () => void;
}

const Topbar: React.FC<Props> = ({ syncTime, isDemo, onOpenSettings }) => (
  <div className="no-print flex-shrink-0 h-[52px] flex items-center gap-4 px-6 shadow-sm z-50"
       style={{ background: 'var(--color-ink)' }}>
    <div className="font-serif text-lg font-bold text-white tracking-wide">
      MRT <span className="text-[#f6c662] italic">Console</span>
    </div>
    <div className="text-[11px] font-normal tracking-[1.5px] uppercase border-l border-[#334966] pl-4"
         style={{ color: '#94a3b8' }}>
      Production Overview
    </div>
    <div className="ml-auto flex items-center gap-3">
      {isDemo && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#f6c662]/20 text-[#f6c662] font-semibold tracking-wide">
          DEMO DATA
        </span>
      )}
      <span className="font-mono text-[10px]" style={{ color: '#64748b' }}>{syncTime}</span>
      <button
        onClick={onOpenSettings}
        className="px-3 py-1 rounded text-[12px] font-medium border cursor-pointer transition-all"
        style={{ background: 'transparent', color: '#94a3b8', borderColor: '#334966' }}
      >
        ⚙ Data Source
      </button>
      <button
        onClick={() => window.print()}
        className="px-3 py-1 rounded text-[12px] font-medium border-none cursor-pointer transition-all"
        style={{ background: '#f6c662', color: 'var(--color-ink)', fontWeight: 600 }}
      >
        🖨 Print Report
      </button>
    </div>
  </div>
);

export default Topbar;
