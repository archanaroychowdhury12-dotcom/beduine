import { ChangeEvent, useState } from 'react';
import { notify } from '@/services/uiFeedback';

const DEFAULT_DASHBOARD_BG = '/images/chatgpt_dashboard_bg.png';
const DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg_v2';
const LEGACY_DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg';

export function useDashboardBackground() {
  const [dashboardBg, setDashboardBg] = useState<string>(() => {
    const saved = localStorage.getItem(DASHBOARD_BG_STORAGE_KEY);
    if (!saved || !saved.startsWith('data:image/')) {
      return DEFAULT_DASHBOARD_BG;
    }
    return saved;
  });

  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify.info('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setDashboardBg(result);
        localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, result);
        localStorage.removeItem(LEGACY_DASHBOARD_BG_STORAGE_KEY);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setDashboardBg(DEFAULT_DASHBOARD_BG);
    localStorage.removeItem(DASHBOARD_BG_STORAGE_KEY);
    localStorage.removeItem(LEGACY_DASHBOARD_BG_STORAGE_KEY);
  };

  const handlePresetBg = (preset: string) => {
    setDashboardBg(preset);
    localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, preset);
  };

  return { dashboardBg, handleBgChange, handleResetBg, handlePresetBg };
}
