'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Settings {
  bannerText: string;
  isBannerActive: boolean;
}

const DEFAULT_BANNER = "✨ WELCOME TO LUXY GALLERIA — Premium Imported Snacks & Drinks ✨";

export default function DynamicBanner() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loaded, setLoaded] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseUrl}/settings`);
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      } catch {
        // Silently fail — use default banner
      } finally {
        setLoaded(true);
      }
    };
    fetchSettings();
  }, [baseUrl]);

  // While loading, show default banner
  const showBanner = !loaded || !settings || settings.isBannerActive !== false;
  const bannerText = settings?.bannerText?.trim() || DEFAULT_BANNER;

  if (!showBanner) return null;

  return (
    <div className="bg-slate-500 text-slate-100 text-[10px] sm:text-xs font-bold py-2.5 relative z-[60] tracking-widest overflow-hidden select-none border-b border-slate-600/20">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {/* First track */}
        <div className="flex shrink-0">
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
        </div>
        {/* Second identical track for seamless loop */}
        <div className="flex shrink-0" aria-hidden="true">
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
          <span className="px-20 sm:px-40 flex items-center">{bannerText}</span>
        </div>
      </div>
    </div>
  );
}
