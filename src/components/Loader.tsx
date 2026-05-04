import React from 'react';

const Loader: React.FC = () => (
  <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-4"
       style={{ background: 'var(--color-ink)' }}>
    <div className="font-serif text-[42px] font-bold text-white tracking-[2px]">
      MRT <span className="text-[#f6c662] italic">Production</span>
    </div>
    <div className="w-[200px] h-[2px] rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <div className="lp h-full" style={{ background: '#f6c662' }} />
    </div>
    <div className="font-mono text-[11px] tracking-[1px]" style={{ color: '#64748b' }}>
      Preparing your production overview…
    </div>
  </div>
);

export default Loader;
