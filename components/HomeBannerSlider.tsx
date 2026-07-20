"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Slider banerów na stronie głównej.
 *
 * Banery to gotowe projekty graficzne (tekst + przycisk „Sprawdź ofertę”
 * są częścią grafiki), dlatego cały slajd jest jednym linkiem do kategorii.
 *
 * Responsywność: na desktopie pokazujemy pełny, szeroki baner (1983×793),
 * a na mobile dedykowany kadr z lewym panelem tekstowym (912×793),
 * żeby napisy pozostały czytelne na wąskim ekranie.
 */

type Slide = {
  id: number;
  /** Pełny baner na ekrany >= md */
  imageDesktop: string;
  /** Kadr z tekstem na ekrany < md */
  imageMobile: string;
  href: string;
  alt: string;
};

const slides: Slide[] = [
  {
    id: 1,
    imageDesktop: "/banners/banner-zwierzeta.jpg",
    imageMobile: "/banners/banner-zwierzeta-mobile.jpg",
    href: "/produkty?category=AKCESORIA_DLA_ZWIERZAT",
    alt: "Wysokiej jakości akcesoria dla zwierząt – legowiska, miski, zabawki, smycze z dostawą w 24h. Sprawdź ofertę.",
  },
  {
    id: 2,
    imageDesktop: "/banners/banner-ogrod.jpg",
    imageMobile: "/banners/banner-ogrod-mobile.jpg",
    href: "/produkty?category=OGROD",
    alt: "Wysokiej jakości wyposażenie ogrodu – meble ogrodowe, hamaki, krzesła, stoliki z dostawą w 24h. Sprawdź ofertę.",
  },
];

const AUTOPLAY_MS = 6000;

export default function HomeBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Autoplay restartuje się po każdej zmianie slajdu (także ręcznej),
  // dzięki czemu strzałki nie "walczą" z automatycznym przełączaniem.
  useEffect(() => {
    const interval = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative overflow-hidden rounded-3xl bg-black shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:rounded-[36px]">
        {/* Proporcje kontenera = proporcje grafiki, więc baner nigdy nie jest
            przycinany ani rozciągany: mobile 912/793, desktop 1983/793. */}
        <div className="relative aspect-[912/793] w-full md:aspect-[1983/793]">
          {slides.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.href}
              aria-label={slide.alt}
              aria-hidden={index !== activeIndex}
              tabIndex={index === activeIndex ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeIndex
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              {/* Desktop – pełny baner */}
              <Image
                src={slide.imageDesktop}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 768px) min(100vw, 1152px), 1px"
                className="hidden object-cover md:block"
              />
              {/* Mobile – kadr z panelem tekstowym */}
              <Image
                src={slide.imageMobile}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 767px) 100vw, 1px"
                className="block object-cover md:hidden"
              />
            </Link>
          ))}

          <button
            type="button"
            onClick={prevSlide}
            aria-label="Poprzedni baner"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Następny baner"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Kropki nawigacji */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Przejdź do banera ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pasek postępu autoplay */}
        <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/10">
          <div
            className="h-full bg-[#4caf3d] transition-all duration-700"
            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
