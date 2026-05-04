import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (url: string) => void;
  onUseDemoData: () => void;
  isDemo: boolean;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, currentUrl, onSave, onUseDemoData, isDemo }) => {
  const [url, setUrl] = useState(currentUrl);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="rounded-lg shadow-2xl w-full max-w-[640px] mx-4 overflow-hidden"
           style={{ background: 'var(--color-sur)' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between"
             style={{ borderColor: 'var(--color-bdr)', background: 'var(--color-ink)' }}>
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Connect to Google Sheets</h2>
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Configure your data source</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl cursor-pointer bg-transparent border-none">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Status */}
          {isDemo ? (
            <div className="mb-4 px-3 py-2 rounded-md text-[12px] border"
                 style={{ background: 'var(--color-amber-bg)', borderColor: 'var(--color-amber-bdr)', color: '#92400e' }}>
              ⚠️ Currently viewing <strong>demo data</strong>. Connect your Google Sheet to see real production data.
            </div>
          ) : currentUrl ? (
            <div className="mb-4 px-3 py-2 rounded-md text-[12px] border"
                 style={{ background: 'var(--color-green-bg)', borderColor: 'var(--color-green-bdr)', color: '#065f46' }}>
              ✓ Connected to your Google Sheet web app.
            </div>
          ) : null}

          {/* Instructions */}
          <div className="mb-4 p-4 rounded-md border text-[12px] leading-relaxed"
               style={{ background: 'var(--color-sur2)', borderColor: 'var(--color-bdr)', color: 'var(--color-txm)' }}>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>How to connect your Google Sheet:</p>
            <ol className="list-decimal ml-4 space-y-1.5">
              <li>Open your Google Sheet → <strong>Extensions</strong> → <strong>Apps Script</strong></li>
              <li>Add this <code className="font-mono text-[11px] px-1 py-0.5 rounded" style={{ background: 'var(--color-sur3)' }}>doGet()</code> function to your script:
                <pre className="mt-2 p-3 rounded text-[10px] font-mono leading-[1.5] overflow-x-auto"
                     style={{ background: 'var(--color-ink)', color: '#e2e8f0' }}>
{`function doGet() {
  var data = getSheetData();
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`}
                </pre>
              </li>
              <li>Click <strong>Deploy</strong> → <strong>New deployment</strong></li>
              <li>Set type to <strong>"Web app"</strong>, access to <strong>"Anyone"</strong></li>
              <li>Copy the <strong>Web app URL</strong> and paste it below</li>
            </ol>
          </div>

          {/* URL Input */}
          <div className="mb-2">
            <label className="block text-[9px] font-semibold tracking-[1px] uppercase mb-1"
                   style={{ color: 'var(--color-txd)' }}>
              Web App URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/XXXXXXX/exec"
              className="w-full px-3 py-2 rounded-md text-[13px] border outline-none font-mono"
              style={{
                background: 'var(--color-sur)',
                borderColor: 'var(--color-bdr2)',
                color: 'var(--color-txt)',
              }}
            />
          </div>

          <p className="text-[10px] mb-5" style={{ color: 'var(--color-txd)' }}>
            Your URL is saved locally in your browser. It never leaves your device.
          </p>

          {/* Expected data format */}
          <details className="mb-4">
            <summary className="text-[11px] font-semibold cursor-pointer" style={{ color: 'var(--color-ink)' }}>
              Expected JSON format from your sheet
            </summary>
            <pre className="mt-2 p-3 rounded text-[10px] font-mono leading-[1.6] overflow-x-auto"
                 style={{ background: 'var(--color-sur2)', color: 'var(--color-txm)' }}>
{`[
  {
    "jc": "JC-2401",
    "item": "PVC_Elbow_90deg_UPVC",
    "die": "D-101",
    "order": 500,
    "molded": 480,
    "finished": 400,
    "passed": 350,
    "rework": 10,
    "rejected": 5,
    "dispatched": 300,
    "activityDate": "2025-01-15"
  },
  ...
]`}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between"
             style={{ borderColor: 'var(--color-bdr)', background: 'var(--color-sur2)' }}>
          <button
            onClick={onUseDemoData}
            className="px-4 py-2 rounded text-[12px] font-medium cursor-pointer border"
            style={{ background: 'transparent', color: 'var(--color-txm)', borderColor: 'var(--color-bdr2)' }}
          >
            Use Demo Data
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-[12px] font-medium cursor-pointer border"
              style={{ background: 'transparent', color: 'var(--color-txm)', borderColor: 'var(--color-bdr2)' }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(url)}
              disabled={!url.trim()}
              className="px-5 py-2 rounded text-[12px] font-semibold cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#f6c662', color: 'var(--color-ink)' }}
            >
              Connect & Load Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
