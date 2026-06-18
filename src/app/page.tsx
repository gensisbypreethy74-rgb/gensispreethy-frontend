"use client";

import HeroSection from "../components/landingPage/HeroSection";
import CategorySection from "../components/landingPage/CategorySection";
import ProductSection from "../components/landingPage/ProductSection";
import VideoTestimonialsSection from "../components/landingPage/VideoTestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <CategorySection />
      <ProductSection />
      <VideoTestimonialsSection />
    </main>
  );
}