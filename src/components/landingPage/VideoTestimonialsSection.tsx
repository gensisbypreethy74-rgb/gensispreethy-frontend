"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import axios from "axios";
import VideoModal from "./VideoModal";

interface VideoTestimonial {
  _id: string;
  clientName: string;
  role: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function VideoTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Modal state
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const res = await axios.get(`${apiURL}/video-testimonials/active`);
        if (res.data.success && res.data.data) {
          setTestimonials(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch video testimonials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Scroll listener to update pagination dots
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = 24; // gap-6 (24px)
        const index = Math.round(scrollLeft / (cardWidth + gap));
        setActiveDot(index);
      }
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = 24;
        carouselRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
      }
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = 24;
        carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      }
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = 24;
        carouselRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
      }
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (testimonials.length <= 1 || !autoplay || selectedVideo) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 15;

        if (isAtEnd) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const card = carouselRef.current.firstElementChild as HTMLElement;
          if (card) {
            const cardWidth = card.getBoundingClientRect().width;
            const gap = 24;
            carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
          }
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [testimonials, autoplay, selectedVideo]);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section 
      className="bg-gradient-to-b from-[#140C05] to-[#0a0603] w-full py-16 md:py-24 overflow-hidden border-t border-b border-[#A68B5B]/10"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <p className="font-sans font-bold text-xs tracking-[0.25em] uppercase text-[#A68B5B]/60 mb-3">
              LUXURY IN MOTION
            </p>
            <h2 className="font-serif font-normal text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Client Success Stories
            </h2>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 0 && !loading && (
            <div className="flex items-center gap-3">
              <button
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:border-[#A68B5B]/50 hover:bg-[#A68B5B]/10 hover:text-[#A68B5B] flex items-center justify-center transition-all duration-300 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:border-[#A68B5B]/50 hover:bg-[#A68B5B]/10 hover:text-[#A68B5B] flex items-center justify-center transition-all duration-300 active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl border border-white/5 bg-white/5 p-6 space-y-6 animate-pulse">
                  <div className="aspect-video w-full rounded-2xl bg-white/5" />
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                    <div className="h-3 w-1/3 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Carousel Scroll List */
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-6"
            >
              {testimonials.map((t) => (
                <div 
                  key={t._id}
                  className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <article 
                    className="group relative rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm p-5 flex flex-col justify-between transition-all duration-500 hover:border-[#A68B5B]/40 hover:-translate-y-1 shadow-lg shadow-black/40 h-full"
                  >
                    {/* Video Thumbnail Wrapper */}
                    <div 
                      onClick={() => setSelectedVideo(t)}
                      className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-white/5 group-hover:border-white/15 transition-all duration-500"
                    >
                      <img 
                        src={t.thumbnailUrl} 
                        alt={`${t.clientName} Video Testimonial`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${t.youtubeId}/0.jpg`;
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:bg-black/45">
                        <div className="w-14 h-14 rounded-full bg-[#A68B5B] text-[#140C05] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#C9A961] shadow-[#A68B5B]/20">
                          <Play className="w-6 h-6 fill-current translate-x-[2px]" />
                        </div>
                      </div>
                    </div>

                    {/* Client Info Block */}
                    <div className="mt-6">
                      <h3 className="font-sans font-bold text-base tracking-[0.05em] uppercase text-white leading-tight group-hover:text-[#C9A961] transition-colors">
                        {t.clientName}
                      </h3>
                      <p className="font-sans font-semibold text-xs tracking-[0.1em] uppercase text-slate-500 mt-1.5">
                        {t.role}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Indicator Dots */}
        {testimonials.length > 1 && !loading && (
          <div className="flex justify-center items-center gap-2.5 mt-8">
            {testimonials.map((_, idx) => {
              // Hide trailing dots for larger screens to avoid empty scrolls
              // (e.g. on 3-col desktop, activeDot reaches up to testimonials.length - 3)
              const maxDots = testimonials.length;
              if (idx >= maxDots) return null;
              
              const isSelected = activeDot === idx;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`h-2 rounded-full transition-all duration-350 ${
                    isSelected 
                      ? "w-8 bg-[#A68B5B]" 
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal Lightbox */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          youtubeId={selectedVideo.youtubeId}
          clientName={selectedVideo.clientName}
        />
      )}
    </section>
  );
}
