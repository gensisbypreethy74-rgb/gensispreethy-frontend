"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAPIURL } from "../../lib/apiClient";

const socials = [
  { 
    label: "Facebook", 
    href: "https://www.facebook.com/share/1BLZJWnKyP/?mibextid=wwXIfr",
    hoverClass: "hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  { 
    label: "Instagram", 
    href: "https://www.instagram.com/genesis.bypreethy/?hl=en",
    hoverClass: "hover:text-[#E4405F] hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.173.055 1.81.25 2.235.415.564.22.962.48 1.383.896.417.42.678.82.897 1.382.164.425.358 1.065.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.055 1.172-.25 1.81-.415 2.235-.22.564-.48 1.383-.896 1.383-.42.417-.82.678-1.382.897-.425.164-1.065.358-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.013-4.85-.07c-1.172-.055-1.81-.25-2.235-.415-.564-.22-.962-.48-1.383-.896-.42-.417-.678-.82-.897-1.382-.164-.425-.358-1.065-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.055-1.172.25-1.81.415-2.235.22-.564.48-1.383.896-1.383.417-.42.82-.678 1.382-.897.425-.164 1.065-.358 2.227-.413 1.266-.057 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.06-2.148.26-2.913.558-.787.306-1.459.717-2.126 1.384-.666.667-1.078 1.335-1.384 2.126-.297.765-.499 1.636-.558 2.913-.058 1.28-.072 1.687-.072 4.947s.014 3.667.072 4.947c.06 1.277.26 2.148.558 2.913.306.787.717 1.459 1.384 2.126.667.666 1.335 1.078 2.126 1.384.765.297 1.636.499 2.913.558 1.28.058 1.687.072 4.947.072s3.667-.014 4.947-.072c1.277-.06 2.148-.26 2.913-.558.787-.306 1.459-.717 2.126-1.384.667-.667 1.079-1.335 1.384-2.126.297-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.26-2.148-.558-2.913-.306-.787-.717-1.459-1.384-2.126-.667-.667-1.335-1.078-2.126-1.384-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0z"/>
        <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
        <path d="M18.406 5.594a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
      </svg>
    )
  }
];

const footerLinks = [
  { label: "About Us", href: "/about" },
];

export default function Footer() {
  const [footerText, setFooterText] = useState("Genesis by Preethy is a premier luxury fashion boutique offering high-end designer clothing, elegant styling, and curated collections tailored for those who appreciate premium quality, style, and absolute sophistication.");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiURL = getAPIURL();
        const res = await axios.get(`${apiURL}/settings`);
        if (res.data.success && res.data.data?.footerText) {
          setFooterText(res.data.data.footerText);
        }
      } catch {
        // Use default text if fetch fails
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-100 text-slate-900 w-full border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-6 transition-all duration-300 group">
              <div className="h-24 w-64 flex items-center justify-start overflow-hidden">
                <img src="/genesis_icon.png" alt="Genesis by Preethy Icon" className="h-full w-full object-contain filter group-hover:drop-shadow-lg transition-all duration-300" />
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              {footerText}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {socials.map(({ svg, label, href, hoverClass }) => (
                <a
                  key={label + href}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-white border-2 border-[#A68B5B]/20 transition-all text-[#A68B5B] ${hoverClass} shadow-sm hover:shadow-md`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  title={label}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links column */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A68B5B] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-600 hover:text-[#A68B5B] transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A68B5B] mb-6">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="mailto:genesisbypreethy74@gmail.com" className="text-slate-600 hover:text-[#A68B5B] transition-colors font-medium">
                  genesisbypreethy74@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919074881551" className="text-slate-600 hover:text-[#A68B5B] transition-colors font-medium">
                  +91 9074881551
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} <span className="font-bold text-[#A68B5B]">Genesis by Preethy</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-slate-500 hover:text-[#A68B5B] transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-slate-500 hover:text-[#A68B5B] transition-colors font-medium">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
