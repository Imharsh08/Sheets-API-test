export interface JobCard {
  jc: string;
  item: string;
  die: string;
  order: number;
  molded: number;
  finished: number;
  passed: number;
  rework: number;
  rejected: number;
  dispatched: number;
  activityDate?: string;
}

export interface InsightChip {
  cls: 'chip-warn' | 'chip-ok' | 'chip-alert' | 'chip-info' | 'chip-neutral';
  ico: string;
  msg: string;
}

export interface ItemGroup {
  item: string;
  die: string;
  molded: number;
  finished: number;
  passed: number;
  rework: number;
  rejected: number;
  dispatched: number;
  order: number;
  jcs: Record<string, JobCardSub>;
}

export interface JobCardSub {
  jc: string;
  molded: number;
  finished: number;
  passed: number;
  rework: number;
  rejected: number;
  dispatched: number;
  order: number;
}

export type TabName = 'unified' | 'pending' | 'itemwise';
export type FocusFilter = '' | 'bottleneck' | 'pend' | 'defect';
