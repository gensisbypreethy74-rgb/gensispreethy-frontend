"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAPIURL } from "../../lib/apiClient";

const socials = [
  { 
    label: "Facebook", 
    href: "https://www.facebook.com/share/1BLZJWnKyP/?mibextid=wwXIfr",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  { 
    label: "Instagram", 
    href: "https://www.instagram.com/luxygalleria?igsh=aDhpM2Zoc3FvejQw",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zm3.94-15.66c.734 0 1.33-.596 1.33-1.33S16.674 3.44 15.94 3.44s-1.33.596-1.33 1.33.596 1.33 1.33 1.33zm-7.88 0c.734 0 1.33-.596 1.33-1.33S9.794 3.44 9.06 3.44 7.73 4.036 7.73 4.77s.596 1.33 1.33 1.33zm3.94 9.66c-2.61 0-4.73-2.12-4.73-4.73s2.12-4.73 4.73-4.73 4.73 2.12 4.73 4.73-2.12 4.73-4.73 4.73zm0-7.73c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/>
      </svg>
    )
  },
  { 
    label: "YouTube", 
    href: "https://youtube.com/@luxysnackstation?si=oqzX6swsa1f5hYBz",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  { 
    label: "Twitter", 
    href: "https://twitter.com",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.953 4.57a10 10 0 002.856-3.51 10.02 10.02 0 01-2.856 1.078c-.983-.588-2.473-.965-4.099-.965-3.104 0-5.626 2.522-5.626 5.626 0 .44.055.88.168 1.298-4.676-.237-8.805-2.475-11.577-5.88-.486.838-.764 1.81-.764 2.85 0 1.953.998 3.68 2.519 4.692-1.01-.032-1.96-.296-2.790-.736v.07c0 2.728 1.938 5.004 4.51 5.525-.473.129-.976.198-1.496.198-.365 0-.72-.035-1.066-.104.72 2.242 2.8 3.88 5.265 3.92-1.926 1.51-4.352 2.41-6.986 2.41-.455 0-.903-.03-1.34-.088 1.968 1.262 4.305 2 6.816 2 8.18 0 12.64-6.776 12.64-12.64 0-.193-.003-.386-.01-.578.867-.627 1.616-1.41 2.21-2.31z"/>
      </svg>
    )
  },
  { 
    label: "LinkedIn", 
    href: "https://linkedin.com",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.435-.103.252-.129.604-.129.956v5.414h-3.554V8.997h3.554v1.495c.471-.72 1.304-1.744 3.171-1.744 2.313 0 4.042 1.511 4.042 4.759v6.945zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 12.019H3.555V8.997h3.564v10.455zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
];

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/products" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export default function Footer() {
  const [footerText, setFooterText] = useState("Luxy Galleria is a trusted online store offering premium quality imported snacks, drinks, and more — with freshness, taste, and customer satisfaction at the core. We provide a wide range of carefully selected products, making it easy for customers to browse, order, and receive their favourite items conveniently.");

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
    <footer className="bg-[#111] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-6 rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="h-16 w-16 flex items-center justify-center overflow-hidden">
                <img src="/luxy_logo.png" alt="Luxy Galleria" className="h-full w-full object-contain" />
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              {footerText}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {socials.map(({ svg, label, href }) => (
                <a
                  key={label + href}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 text-slate-400 hover:text-blue-400"
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
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="mailto:infoluxygalleria@gmail.com" className="hover:text-white transition-colors">
                  infoluxygalleria@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919074881551" className="hover:text-white transition-colors">
                  +91 9074881551
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Luxy Galleria. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
