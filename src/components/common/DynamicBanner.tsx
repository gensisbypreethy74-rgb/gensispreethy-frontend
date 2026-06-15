'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Settings {
  bannerText: string;
  isBannerActive: boolean;
}

export default function DynamicBanner() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseUrl}/settings`);
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      } catch (error) {
        // Silently fail — banner is non-critical
      }
    };
    fetchSettings();
  }, [baseUrl]);

  if (!settings || !settings.isBannerActive || !settings.bannerText) return null;

  // Split by newlines to support multiple sentences from admin
  const lines = settings.bannerText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  return (
    <div className="bg-[#1a1a1a] text-white text-xs font-medium text-center py-2.5 px-4 relative z-[60]">
      {lines.length === 1 ? (
        <p>{lines[0]}</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {lines.map((line, i) => (
            <p key={i} className={i === 0 ? 'font-semibold' : 'text-white/70'}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
