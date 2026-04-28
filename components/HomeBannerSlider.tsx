"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type HomeBannerSliderProps = {
  onSaleClick: () => void;
  onNewClick: () => void;
};

const slides = [
  {
    id: 1,
    image: "/banners/banner-1.jpg",
    eyebrow: "oferta specjalna",
    title: "Wyprzedaż do -50% na wybrane produkty",
    description:
      "Odkryj starannie wyselekcjonowane promocje i skorzystaj z najlepszych cen na wybrane produkty w ofercie sklepu.",
    primaryLabel: "Przejdź do wyprzedaży",
    secondaryLabel: "Zobacz nowości",
    primaryAction: "sale",
    secondaryAction: "new",
    badge: "-50%",
    statLabel: "Na wybrane produkty",
  },
  {
    id: 2,
    image: "/banners/banner-2.jpg",
    eyebrow: "nowa kolekcja",
    title: "Nowości dostępne już teraz",
    description:
      "Poznaj najnowsze produkty dodane do sklepu i przeglądaj świeżą ofertę przygotowaną z myślą o nowoczesnych zakupach.",
    primaryLabel: "Zobacz nowości",
    secondaryLabel: "Sprawdź promocje",
    primaryAction: "new",
    secondaryAction: "sale",
    badge: "NEW",
    statLabel: "Świeżo dodane produkty",
  },
  {
    id: 3,
    image: "/banners/banner-3.jpg",
    eyebrow: "dom i ogród",
    title: "Styl i funkcjonalność do domu i ogrodu",
    description:
      "Wybierz produkty do wyposażenia wnętrz i akcesoria ogrodowe, które łączą estetykę, wygodę i praktyczne zastosowanie.",
    primaryLabel: "Przeglądaj ofertę",
    secondaryLabel: "Zobacz promocje",
    primaryAction: "new",
    secondaryAction: "sale",
    badge: "HOME",
    statLabel: "Wybrane inspiracje",
  },
];

export default function HomeBannerSlider({
  onSaleClick,
  onNewClick,
}: HomeBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: string) => {
    if (action === "sale") {
      onSaleClick();
      return;
    }

    onNewClick();
  };

  const activeSlide = slides[activeIndex];

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="relative overflow-hidden rounded-[36px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-0">
          <Image
            src={activeSlide.image}
            alt={activeSlide.title}
            fill
            priority
            className="object-cover opacity-55 transition duration-700"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
        </div>

        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Poprzedni slajd"
          className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Następny slajd"
          className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="relative grid min-h-[500px] gap-10 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex max-w-2xl flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-md">
                {activeSlide.eyebrow}
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black">
                {activeSlide.badge}
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl xl:text-6xl">
              {activeSlide.title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/78 md:text-lg">
              {activeSlide.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => handleAction(activeSlide.primaryAction)}
                className="rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-95"
              >
                {activeSlide.primaryLabel}
              </button>

              <button
                type="button"
                onClick={() => handleAction(activeSlide.secondaryAction)}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                {activeSlide.secondaryLabel}
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/70">
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="mt-1">Zakupy online</p>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div>
                <p className="text-2xl font-bold text-white">Premium</p>
                <p className="mt-1">{activeSlide.statLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <div className="w-full max-w-sm rounded-[28px] border border-white/15 bg-white/10 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                aktualna kolekcja
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Oferta</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {activeSlide.badge}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Korzyść</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {activeSlide.statLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/60">Wyróżnik</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Starannie dobrana oferta
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Przejdź do slajdu ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-10 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
          <div
            className="h-full bg-white transition-all duration-700"
            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}