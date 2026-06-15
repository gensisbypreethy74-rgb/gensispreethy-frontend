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
        console.error('Error fetching settings for banner:', error);
      }
    };
    fetchSettings();
  }, [baseUrl]);

  if (!settings || !settings.isBannerActive || !settings.bannerText) return null;

  return (
    <div className="bg-[#A68B5B] text-white text-sm font-semibold text-center py-2 px-4 shadow-sm relative z-[60] whitespace-pre-wrap break-words">
      {settings.bannerText}
    </div>
  );
}
