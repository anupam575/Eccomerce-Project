"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const slides = [
  { img: "/banner1.jpg", title: "Mega Sale", subtitle: "Up to 60% off" },
  { img: "/banner2.jpg", title: "New Arrivals", subtitle: "Trending Products" },
  { img: "/banner3.jpg", title: "Best Deals", subtitle: "Limited Time Offers" },
  { img: "/banner4.jpg", title: "Amazon Choice", subtitle: "Top Rated Items" },
  { img: "/banner5.jpg", title: "Fast Delivery", subtitle: "Doorstep in 24h" },
  { img: "/banner6.jpg", title: "Electronics Fest", subtitle: "Latest Gadgets" },
  { img: "/banner7.jpg", title: "Fashion Week", subtitle: "Top Brands Sale" },
  { img: "/banner8.jpg", title: "Home Essentials", subtitle: "Daily Needs" },
  { img: "/banner9.jpg", title: "Beauty Picks", subtitle: "Glow Everyday" },
  { img: "/banner10.jpg", title: "Clearance Sale", subtitle: "Last Chance Deals" },
];

const extendedSlides = [
  slides[slides.length - 1],
  ...slides,
  slides[0],
];

const Middle = () => {
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const intervalRef = useRef(null);
  const startX = useRef(0);
  const startTime = useRef(0);

  /* AUTOPLAY */

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setIndex((p) => p + 1);
    }, 4000);
  };

  const stopAutoPlay = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, []);

  /* INFINITE FIX */

  useEffect(() => {
    if (index === extendedSlides.length - 1) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(1);
      }, 700);
    }

    if (index === 0) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(extendedSlides.length - 2);
      }, 700);
    }
  }, [index]);

  useEffect(() => {
    if (!enableTransition)
      requestAnimationFrame(() => setEnableTransition(true));
  }, [enableTransition]);

  /* SWIPE */

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    stopAutoPlay();
  };

  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    const velocity = Math.abs(diff / (Date.now() - startTime.current));

    if (diff > 40 || velocity > 0.6) setIndex((p) => p + 1);
    if (diff < -40 || velocity > 0.6) setIndex((p) => p - 1);

    startAutoPlay();
  };

  const realIndex =
    index === 0
      ? slides.length - 1
      : index === extendedSlides.length - 1
      ? 0
      : index - 1;

  return (
    <div
      className="relative -mt-12 md:-mt-16 w-full h-[260px] sm:h-[320px] md:h-[420px] sm:-mt-16 lg:h-[480px] xl:h-[620px] overflow-hidden group"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skeleton */}

      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-20" />
      )}

      {/* SLIDER */}

      <div
        className={`flex h-full ${
          enableTransition ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {extendedSlides.map((slide, i) => (
          <div key={i} className="relative min-w-full h-full">
            <div className="absolute inset-0 scale-100 transition-transform duration-[1200ms]">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={i === 1}
                onLoad={() => setLoaded(true)}
                className="object-cover"
              />
            </div>

            {/* TEXT */}

            {realIndex === i - 1 && (
              <div className="absolute left-4 sm:left-8 md:left-16 bottom-6 md:bottom-16 text-white animate-fadeInUp">
                <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold">
                  {slide.title}
                </h2>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* OVERLAYS */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* ARROWS */}

      {[{ dir: -1, Icon: ArrowBackIosNew }, { dir: 1, Icon: ArrowForwardIos }].map(
        ({ dir, Icon }, i) => (
          <button
            key={i}
            onClick={() => setIndex((p) => p + dir)}
            className={`absolute ${
              dir === -1 ? "left-2 md:left-4" : "right-2 md:right-4"
            } top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/80 rounded-full flex items-center justify-center shadow hover:scale-110 active:scale-95 transition`}
          >
            <Icon fontSize="small" />
          </button>
        )
      )}

      {/* DOTS */}

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i + 1)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-transform ${
              realIndex === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Middle;