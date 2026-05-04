import React from 'react';
import { InsightChip } from '../types';

interface Props {
  insights: InsightChip[];
  dateLabel: string;
}

const InsightsBanner: React.FC<Props> = ({ insights, dateLabel }) => {
  if (insights.length === 0) return null;

  return (
    <div className="flex-shrink-0 border-b px-6 py-3.5"
         style={{ background: 'var(--color-sur)', borderColor: 'var(--color-bdr)' }}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="font-serif text-[13px] font-semibold tracking-[0.3px]"
              style={{ color: 'var(--color-ink)' }}>
          Today's Production Briefing
        </span>
        <span className="font-mono text-[10px] ml-auto" style={{ color: 'var(--color-txd)' }}>
          {dateLabel}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {insights.map((chip, i) => (
          <div key={i}
               className={`${chip.cls} inline-flex items-start gap-[7px] py-[7px] px-3 rounded-md text-[12px] font-normal leading-[1.4] max-w-[360px] border`}>
            <span className="text-sm flex-shrink-0">{chip.ico}</span>
            <span>{chip.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsBanner;
