import React, { useEffect, useState } from 'react';

export type ToastType = 'ok' | 'err' | 'info';

interface ToastMessage {
  text: string;
  type: ToastType;
  id: number;
}

let _setToast: React.Dispatch<React.SetStateAction<ToastMessage | null>> | null = null;
let _counter = 0;

export function showToast(text: string, type: ToastType = 'info') {
  if (_setToast) {
    _setToast({ text, type, id: ++_counter });
  }
}

const Toast: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);
  _setToast = setToast;

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      const remove = setTimeout(() => setToast(null), 3300);
      return () => { clearTimeout(timer); clearTimeout(remove); };
    }
  }, [toast?.id]);

  if (!toast) return null;

  const borderColor = toast.type === 'ok' ? 'var(--color-green)' : toast.type === 'err' ? 'var(--color-red)' : 'var(--color-amber)';
  const textColor = borderColor;

  return (
    <div
      className="fixed bottom-5 right-5 z-[999] rounded-md px-4 py-2.5 text-[12px] shadow-lg max-w-[320px] transition-all duration-250"
      style={{
        background: 'var(--color-sur)',
        borderLeft: `3px solid ${borderColor}`,
        color: textColor,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        opacity: visible ? 1 : 0,
      }}
    >
      {toast.text}
    </div>
  );
};

export default Toast;
