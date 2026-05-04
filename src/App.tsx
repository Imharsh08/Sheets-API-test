import { useState, useEffect, useMemo, useCallback } from 'react';
import { JobCard, TabName, FocusFilter } from './types';
import { generateMockData } from './data/mockData';
import { getSavedUrl, saveUrl, clearUrl, fetchSheetData } from './utils/sheetsApi';
import { buildInsights } from './utils/insights';
import { computeKpi } from './utils/kpi';
import { filterData, getUniqueDies, getUniqueMaterials } from './utils/filters';

import Topbar from './components/Topbar';
import InsightsBanner from './components/InsightsBanner';
import KpiRow from './components/KpiRow';
import Controls from './components/Controls';
import Tabs from './components/Tabs';
import UnifiedTable from './components/UnifiedTable';
import PendingTable from './components/PendingTable';
import ItemwiseTable from './components/ItemwiseTable';
import Loader from './components/Loader';
import SettingsModal from './components/SettingsModal';
import Toast, { showToast } from './components/Toast';

function isoDate(d: Date) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<JobCard[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [syncTime, setSyncTime] = useState('—');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [die, setDie] = useState('');
  const [mat, setMat] = useState('');
  const [focus, setFocus] = useState<FocusFilter>('');
  const [tab, setTab] = useState<TabName>('unified');

  const today = useMemo(() => new Date(), []);
  const weekAgo = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; }, []);
  const [dateFrom, setDateFrom] = useState(() => isoDate(weekAgo));
  const [dateTo, setDateTo] = useState(() => isoDate(today));

  const dateLabel = useMemo(() =>
    today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    [today]
  );

  // Load data on mount
  useEffect(() => {
    const url = getSavedUrl();
    if (url) {
      loadFromSheet(url);
    } else {
      loadDemoData();
    }
  }, []);

  const loadDemoData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockData();
      setRawData(data);
      setIsDemo(true);
      setSyncTime('Demo data');
      setLoading(false);
      clearUrl();
    }, 800);
  }, []);

  const loadFromSheet = useCallback(async (url: string) => {
    setLoading(true);
    try {
      const data = await fetchSheetData(url);
      setRawData(data);
      setIsDemo(false);
      saveUrl(url);
      setSyncTime('Synced at ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      showToast(`Loaded ${data.length} job cards from Google Sheets`, 'ok');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      showToast('Failed to load: ' + msg, 'err');
      // Fall back to demo if no data yet
      if (rawData.length === 0) {
        loadDemoData();
      }
    } finally {
      setLoading(false);
    }
  }, [rawData.length, loadDemoData]);

  const handleSaveUrl = useCallback((url: string) => {
    setSettingsOpen(false);
    loadFromSheet(url);
  }, [loadFromSheet]);

  const handleUseDemoData = useCallback(() => {
    setSettingsOpen(false);
    loadDemoData();
  }, [loadDemoData]);

  // Derived data
  const dies = useMemo(() => getUniqueDies(rawData), [rawData]);
  const materials = useMemo(() => getUniqueMaterials(rawData), [rawData]);
  const insights = useMemo(() => buildInsights(rawData), [rawData]);
  const kpi = useMemo(() => computeKpi(rawData), [rawData]);

  const filtered = useMemo(() =>
    filterData(rawData, { search, die, mat, focus, dateFrom, dateTo }),
    [rawData, search, die, mat, focus, dateFrom, dateTo]
  );

  const hasFilter = !!(search || die || mat || focus);

  if (loading) return <Loader />;

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Topbar syncTime={syncTime} isDemo={isDemo} onOpenSettings={() => setSettingsOpen(true)} />
      <InsightsBanner insights={insights} dateLabel={dateLabel} />
      <KpiRow kpi={kpi} />
      <Controls
        search={search} onSearch={setSearch}
        dies={dies} die={die} onDie={setDie}
        materials={materials} mat={mat} onMat={setMat}
        dateFrom={dateFrom} onDateFrom={setDateFrom}
        dateTo={dateTo} onDateTo={setDateTo}
        focus={focus} onFocus={setFocus}
        filteredCount={filtered.length}
        totalCount={rawData.length}
        hasFilter={hasFilter}
      />
      <Tabs active={tab} onChange={setTab} />

      {tab === 'unified' && <UnifiedTable data={filtered} />}
      {tab === 'pending' && <PendingTable data={filtered} />}
      {tab === 'itemwise' && <ItemwiseTable data={filtered} />}

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUrl={getSavedUrl()}
        onSave={handleSaveUrl}
        onUseDemoData={handleUseDemoData}
        isDemo={isDemo}
      />
      <Toast />
    </div>
  );
}
