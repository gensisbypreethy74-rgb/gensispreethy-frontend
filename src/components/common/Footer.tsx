"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAPIURL } from "../../lib/apiClient";

const socials = [
  { src: "/social/facebook.svg", label: "Facebook", href: "https://www.facebook.com/share/1BLZJWnKyP/?mibextid=wwXIfr" },
  { src: "/social/instagram.svg", label: "Instagram Luxy Galleria", href: "https://www.instagram.com/luxygalleria?igsh=aDhpM2Zoc3FvejQw" },
  { src: "/social/instagram.svg", label: "Instagram Snack Station", href: "https://www.instagram.com/luxysnackstation?igsh=MXAyNWQwZmZtaHoydQ==" },
  { src: "/social/snapchat.svg", label: "Snapchat", href: "https://www.snapchat.com/add/luxygalleria" },
  { src: "/social/youtube.svg", label: "YouTube", href: "https://youtube.com/@luxysnackstation?si=oqzX6swsa1f5hYBz" },
];

export default function Footer() {
  const [footerText, setFooterText] = useState("More than a snack store, a destination for worldwide treats and everyday cravings.");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiURL = getAPIURL();
        const res = await axios.get(`${apiURL}/settings`);
        if (res.data.success && res.data.data) {
          if (res.data.data.footerText) {
            setFooterText(res.data.data.footerText);
          }
          if (res.data.data.whatsappNumber) {
            setWhatsappNumber(res.data.data.whatsappNumber);
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
        // Use default text if fetch fails
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#f8efe6] w-full border-t border-[#e7d7c6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-6 rounded-[28px] bg-white p-3 shadow-sm shadow-[#e4d3c5]/50">
              <div className="h-20 w-20 flex items-center justify-center overflow-hidden">
                <img src="/luxy_logo.png" alt="Luxy Galleria" className="h-full w-full object-contain" />
              </div>
            </Link>
            <p className="max-w-lg text-base leading-8 text-[#8a6b4f]">
              {footerText}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map(({ src, label, href }) => (
                <a
                  key={label + href}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-[#d9c0a3] shadow-sm transition hover:bg-[#f7efe7]"
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <img src={src} alt={label} className="h-6 w-6 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
