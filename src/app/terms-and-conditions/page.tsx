"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <title>Terms & Conditions – GENESIS BY PREETHY</title>
      <meta
        name="description"
        content="Read the Terms & Conditions of GENESIS BY PREETHY. Learn about the rules and regulations for using our website."
      />

      <main id="top" className="min-h-screen bg-slate-50">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          className="relative w-full pt-32 md:pt-40 pb-36 md:pb-48"
          style={{
            background:
              "linear-gradient(135deg, #050505 0%, #0F0F0F 50%, #1A1A1A 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            {/* Mobile Back to Home */}
            <div
              className="md:hidden flex justify-center mb-8"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition: "opacity 0.5s ease 50ms, transform 0.5s ease 50ms",
              }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-sm shadow-sm"
              >
                <ChevronLeft size={16} />
                Back to Home
              </Link>
            </div>

            {/* Headline */}
            <h1
              className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition:
                  "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
              }}
            >
              Terms & Conditions
            </h1>

            {/* Subheadline */}
            <p
              className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition:
                  "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
              }}
            >
              Welcome to GENESIS BY PREETHY. By accessing or using our website, you agree to comply with these Terms & Conditions.
            </p>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────── */}
        <section
          className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto -mt-20 md:-mt-24 mb-20"
        >
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 lg:p-16 border border-slate-100">
            <p className="text-slate-500 mb-8 font-medium">Last Updated: May 2, 2026</p>

            <div className="space-y-8 text-slate-700 leading-relaxed font-sans">
              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">1. Introduction</h2>
                <p>
                  These Terms & Conditions govern your access to and use of the GENESIS BY PREETHY website and services. By using this site, you agree to comply with these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">2. Product Information</h2>
                <p>
                  We make every effort to present accurate product information, pricing, and availability. However, GENESIS BY PREETHY does not guarantee that all information is error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">3. Orders & Payments</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders are confirmed only after successful payment.</li>
                  <li>Payments are processed through licensed payment gateways.</li>
                  <li>We may cancel orders for stock unavailability, pricing errors, or suspected fraudulent activity.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">4. Shipping & Delivery</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery timelines are estimates and depend on the destination and courier partner.</li>
                  <li>Shipping fees are displayed during checkout and depend on the order details.</li>
                  <li>GENESIS BY PREETHY is not responsible for delays caused by courier services or external disruptions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">5. Returns & Refunds</h2>
                <p>
                  Returns and refunds are subject to our return policy. Please inspect items on delivery and raise any concerns promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">6. User Conduct</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate account and shipping information.</li>
                  <li>Do not use the website for unlawful or unauthorized activities.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">7. Intellectual Property</h2>
                <p>
                  All content on this site, including text, images, logos, and designs, is the property of GENESIS BY PREETHY and may not be used without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">8. Limitation of Liability</h2>
                <p>
                  GENESIS BY PREETHY is not liable for any indirect, incidental, or consequential losses, including allergic reactions, delays, or loss of income.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">9. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of Indian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#C5A866] mb-4">10. Contact Us</h2>
                <p className="mb-2">Email: <a href="mailto:genesisbypreethy74@gmail.com" className="text-[#C5A866] hover:text-[#A88F52] transition-colors">genesisbypreethy74@gmail.com</a></p>
                <p>Phone: <a href="tel:+919074881551" className="text-[#C5A866] hover:text-[#A88F52] transition-colors">+91 9074881551</a></p>
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
