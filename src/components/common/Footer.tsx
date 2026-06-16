"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAPIURL } from "../../lib/apiClient";
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";

const socials = [
  { 
    icon: Facebook, 
    label: "Facebook", 
    href: "https://www.facebook.com/share/1BLZJWnKyP/?mibextid=wwXIfr",
    color: "text-slate-400 hover:text-blue-400"
  },
  { 
    icon: Instagram, 
    label: "Instagram", 
    href: "https://www.instagram.com/luxygalleria?igsh=aDhpM2Zoc3FvejQw",
    color: "text-slate-400 hover:text-pink-400"
  },
  { 
    icon: Youtube, 
    label: "YouTube", 
    href: "https://youtube.com/@luxysnackstation?si=oqzX6swsa1f5hYBz",
    color: "text-slate-400 hover:text-red-400"
  },
  { 
    icon: Twitter, 
    label: "Twitter", 
    href: "https://twitter.com",
    color: "text-slate-400 hover:text-blue-300"
  },
  { 
    icon: Linkedin, 
    label: "LinkedIn", 
    href: "https://linkedin.com",
    color: "text-slate-400 hover:text-blue-500"
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
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label + href}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 ${color}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  title={label}
                >
                  <Icon size={20} strokeWidth={1.5} />
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
