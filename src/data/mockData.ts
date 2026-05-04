import { JobCard } from '../types';

const items = [
  'PVC_Elbow_90deg_UPVC',
  'PVC_Tee_Equal_CPVC',
  'PP_Coupling_Threaded_PP',
  'HDPE_Reducer_Bush_HDPE',
  'PVC_Ball_Valve_UPVC',
  'PP_End_Cap_PP',
  'PVC_Union_Plain_CPVC',
  'HDPE_Flange_Adapter_HDPE',
  'PVC_Pipe_Clip_UPVC',
  'PP_Tank_Connector_PP',
  'PVC_Bend_45deg_UPVC',
  'CPVC_Socket_Plain_CPVC',
  'PP_Y_Connector_PP',
  'HDPE_Saddle_Clamp_HDPE',
  'PVC_NRV_Check_UPVC',
  'PVC_Gate_Valve_CPVC',
  'PP_Foot_Valve_PP',
  'HDPE_Compression_Tee_HDPE',
  'PVC_Solvent_Cement_Joint_UPVC',
  'PP_Male_Adapter_PP',
  'PVC_Female_Adapter_UPVC',
  'CPVC_Elbow_45deg_CPVC',
  'PVC_Cross_Tee_UPVC',
  'PP_Reducer_Socket_PP',
  'HDPE_Butt_Weld_Elbow_HDPE',
];

const dies = [
  'D-101','D-102','D-103','D-104','D-105',
  'D-201','D-202','D-203','D-204','D-205',
  'D-301','D-302','D-303','D-304',
  'D-401','D-402','D-403',
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isoDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export function generateMockData(): JobCard[] {
  const data: JobCard[] = [];

  for (let i = 0; i < 42; i++) {
    const order = randInt(200, 2000);
    const moldPct = Math.random();
    const molded = moldPct < 0.08 ? 0 : Math.min(order, Math.round(order * (0.3 + Math.random() * 0.7)));
    const finPct = Math.random();
    const finished = molded === 0 ? 0 : finPct < 0.05 ? 0 : Math.min(molded, Math.round(molded * (0.2 + Math.random() * 0.8)));
    const passed = finished === 0 ? 0 : Math.min(finished, Math.round(finished * (0.4 + Math.random() * 0.6)));

    const hasRework = Math.random() < 0.25;
    const rework = hasRework ? randInt(5, Math.max(5, Math.round(finished * 0.08))) : 0;
    const hasReject = Math.random() < 0.15;
    const rejected = hasReject ? randInt(2, Math.max(2, Math.round(finished * 0.05))) : 0;

    const dispatched = passed === 0 ? 0 : Math.min(passed, Math.round(passed * (0.3 + Math.random() * 0.7)));

    data.push({
      jc: `JC-${String(2400 + i).padStart(4, '0')}`,
      item: items[i % items.length],
      die: dies[i % dies.length],
      order,
      molded,
      finished,
      passed,
      rework,
      rejected,
      dispatched,
      activityDate: isoDate(randInt(0, 10)),
    });
  }

  // Inject a few specific scenarios for better insights:
  // 1. Near-complete order
  data[0] = { ...data[0], order: 500, molded: 500, finished: 500, passed: 500, dispatched: 480, rework: 0, rejected: 0 };
  // 2. Molding bottleneck
  data[3] = { ...data[3], order: 1500, molded: 200, finished: 180, passed: 150, dispatched: 100, rework: 0, rejected: 0 };
  // 3. High rejection
  data[7] = { ...data[7], order: 800, molded: 800, finished: 750, passed: 600, dispatched: 500, rework: 30, rejected: 45 };
  // 4. Finishing bottleneck
  data[10] = { ...data[10], order: 1000, molded: 950, finished: 300, passed: 280, dispatched: 200, rework: 10, rejected: 0 };
  // 5. Ready to dispatch
  data[15] = { ...data[15], order: 600, molded: 600, finished: 600, passed: 590, dispatched: 100, rework: 0, rejected: 0 };

  return data;
}
