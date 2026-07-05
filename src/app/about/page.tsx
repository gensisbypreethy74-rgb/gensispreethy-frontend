"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AboutPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <title>About Us – GENESIS BY PREETHY</title>
      <meta name="description" content="Learn about Genesis by Preethy — India's premier destination for luxury & premium designer clothing and styling." />

      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section
          className="relative w-full pt-32 md:pt-40 pb-36 md:pb-48"
          style={{ background: "linear-gradient(135deg, #050505 0%, #0F0F0F 50%, #1A1A1A 100%)" }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div
              className="md:hidden flex justify-center mb-8"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(1rem)", transition: "opacity 0.5s ease 50ms, transform 0.5s ease 50ms" }}
            >
              <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold bg-white/10 px-5 py-2.5 rounded-full border border-white/20">
                <ChevronLeft size={16} /> Back to Home
              </Link>
            </div>
            <h1
              className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(1rem)", transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms" }}
            >
              About Us
            </h1>
            <p
              className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(1rem)", transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms" }}
            >
              India's premier destination for luxury designer clothing & bespoke fashion styling.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto -mt-20 md:-mt-24 mb-20">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 lg:p-16 border border-slate-100 space-y-10 text-slate-700 leading-relaxed font-sans">

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">Who We Are</h2>
              <p>
                Genesis by Preethy is a luxury fashion boutique dedicated to bringing high-end designer clothing, elegant wear, and couture directly to discerning clients across India. We believe that style is a personal statement, and everyone deserves access to exceptional craftsmanship and luxury designs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">Our Story</h2>
              <p>
                Founded with a deep passion for elegant aesthetics and premium materials, Genesis by Preethy started as an exclusive boutique brand. Today, we serve fashion-forward clients all over India, offering custom styling options, designer ensembles, and high-fashion collections sourced and crafted under high quality control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium boutique design collections</li>
                <li>Elegant designer clothing and couture wear</li>
                <li>Bespoke styling suggestions and customizations</li>
                <li>High-end designer accessories and styling services</li>
                <li>Secure delivery across India with premium packaging</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">Our Promise</h2>
              <p>
                Every collection at Genesis by Preethy is hand-curated for premium quality, texture, design excellence, and authenticity. We are committed to providing an unmatched shopping experience — from customized styling advice to secure checkout and delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">Find Us On Social Media</h2>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                <a href="https://www.facebook.com/share/1BLZJWnKyP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#C5A866] hover:text-[#A88F52] font-medium transition-colors">
                  Facebook
                </a>
                <span className="text-slate-300">|</span>
                <a href="https://www.instagram.com/genesis.bypreethy/?hl=en" target="_blank" rel="noopener noreferrer" className="text-[#C5A866] hover:text-[#A88F52] font-medium transition-colors">
                  Instagram (@genesis.bypreethy)
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#C5A866] mb-4">Contact Us</h2>
              <p className="mb-2">Email: <a href="mailto:genesisbypreethy74@gmail.com" className="text-[#C5A866] hover:text-[#A88F52] transition-colors">genesisbypreethy74@gmail.com</a></p>
              <p>Phone: <a href="tel:+917736605422" className="text-[#C5A866] hover:text-[#A88F52] transition-colors">+91 77366 05422</a></p>
            </section>

          </div>
        </section>
      </main>
    </>
  );
}
