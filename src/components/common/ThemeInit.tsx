'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAPIURL } from '../../lib/apiClient';

interface Settings {
  primaryColor?: string;
  secondaryColor?: string;
}

export default function ThemeInit() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiURL = getAPIURL();
        const res = await axios.get(`${apiURL}/settings`);
        if (res.data.success && res.data.data) {
          const { primaryColor, secondaryColor } = res.data.data;
          setSettings({ primaryColor, secondaryColor });
        }
      } catch (err) {
        console.error('Failed to fetch theme settings:', err);
      }
    };
    fetchSettings();
  }, []);

  if (!settings || (!settings.primaryColor && !settings.secondaryColor)) {
    return null;
  }

  const primary = (settings.primaryColor || '#8B5E34').trim();
  const secondary = (settings.secondaryColor || '#F5F1E8').trim();

  // Helper to convert hex to RGB for opacity utilities
  const hexToRgb = (hex: string) => {
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith('#')) {
      cleanHex = '#' + cleanHex;
    }
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = cleanHex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '139, 94, 52';
  };

  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);

  // We inject a custom style block to override the hardcoded colors globally
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --luxy-primary: ${primary} !important;
          --luxy-primary-dark: ${primary} !important;
          --luxy-light: ${secondary} !important;
          --background: ${secondary} !important;
          
          /* Tailwind v4 CSS variables mapping */
          --color-slate-50: rgba(${secondaryRgb}, 0.3) !important;
          --color-slate-100: ${secondary} !important;
          --color-slate-200: rgba(${secondaryRgb}, 0.8) !important;
          --color-slate-400: ${primary} !important;
          --color-slate-500: ${primary} !important;
          --color-blue-50: rgba(${secondaryRgb}, 0.3) !important;
          --color-blue-100: ${secondary} !important;
          --color-blue-500: ${primary} !important;
          --color-blue-600: ${primary} !important;
        }

        /* Override hardcoded [#8B5E34] class rules in the compiled CSS */
        [class*="[#8B5E34]"] {
          --tw-bg-opacity: 1;
        }
        .bg-\\[\\#8B5E34\\] { background-color: ${primary} !important; }
        .text-\\[\\#8B5E34\\] { color: ${primary} !important; }
        .border-\\[\\#8B5E34\\] { border-color: ${primary} !important; }
        .hover\\:bg-\\[\\#8B5E34\\]:hover { background-color: ${primary} !important; }
        .hover\\:text-\\[\\#8B5E34\\]:hover { color: ${primary} !important; }
        .hover\\:border-\\[\\#8B5E34\\]:hover { border-color: ${primary} !important; }
        .focus\\:ring-\\[\\#8B5E34\\]:focus { --tw-ring-color: ${primary} !important; }

        /* Override hardcoded [#A68B5B] class rules in the compiled CSS */
        .bg-\\[\\#A68B5B\\] { background-color: ${primary} !important; }
        .text-\\[\\#A68B5B\\] { color: ${primary} !important; }
        .border-\\[\\#A68B5B\\] { border-color: ${primary} !important; }
        .hover\\:bg-\\[\\#A68B5B\\]:hover { background-color: ${primary} !important; }
        .hover\\:text-\\[\\#A68B5B\\]:hover { color: ${primary} !important; }
        .focus\\:ring-\\[\\#A68B5B\\]:focus { --tw-ring-color: ${primary} !important; }

        /* Special overrides for opacity/transparent/utility classes of hardcoded colors */
        .bg-\\[\\#A68B5B\\]\\/5 { background-color: rgba(${primaryRgb}, 0.05) !important; }
        .bg-\\[\\#A68B5B\\]\\/10 { background-color: rgba(${primaryRgb}, 0.1) !important; }
        .border-\\[\\#A68B5B\\]\\/20 { border-color: rgba(${primaryRgb}, 0.2) !important; }
        .hover\\:bg-\\[\\#A68B5B\\]\\/10:hover { background-color: rgba(${primaryRgb}, 0.1) !important; }
        .hover\\:bg-\\[\\#A68B5B\\]\\/5:hover { background-color: rgba(${primaryRgb}, 0.05) !important; }
        .shadow-\\[\\#8B5E34\\]\\/20 { --tw-shadow-color: rgba(${primaryRgb}, 0.2) !important; }
        .shadow-\\[\\#A68B5B\\]\\/50\\/30 { --tw-shadow-color: rgba(${primaryRgb}, 0.3) !important; }
      `
    }} />
  );
}
