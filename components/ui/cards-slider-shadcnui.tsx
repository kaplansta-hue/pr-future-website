"use client";

import { Card } from "@/components/ui/card";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

// Strictly typed for the Syllabus structure
interface SyllabusCardData {
  id: number;
  levelTitle: string;
  role: string;
  headerImage: string;
  description: string;
  features: string[];
  projectLabel: string;
  projectDetails: string;
  incomeLabel: string;
  incomeAmount: string;
  paymentLink: string;
  buttonText: string;
}

/* ─────────────────────────────────────────────────────────────────
   Build the cards array from the live i18n system so the exact
   Cyrillic (Russian), Hebrew, and English text is served correctly
   depending on the active language — no dummy data.
───────────────────────────────────────────────────────────────── */
function getCards(t: (k: string) => string): SyllabusCardData[] {
  return [
    {
      id: 1,
      levelTitle: t("yf.c1.label"),
      role: t("yf.c1.title"),
      headerImage: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
      description: t("yf.c1.sub"),
      features: [
        t("yf.c1.f1"),
        t("yf.c1.f2"),
        t("yf.c1.f3"),
        t("yf.c1.f4"),
        t("yf.c1.f5"),
      ],
      projectLabel: t("card.signatureProject"),
      projectDetails: t("yf.c1.project"),
      incomeLabel: t("card.incomeGoal"),
      incomeAmount: t("yf.c1.income"),
      paymentLink: "https://pages.greeninvoice.co.il/payments/links/de13e706-1dbb-4181-b92d-6d6295ddc710",
      buttonText: t("card.enrollButton"),
    },
    {
      id: 2,
      levelTitle: t("yf.c2.label"),
      role: t("yf.c2.title"),
      headerImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
      description: t("yf.c2.sub"),
      features: [
        t("yf.c2.f1"),
        t("yf.c2.f2"),
        t("yf.c2.f3"),
      ],
      projectLabel: t("card.signatureProject"),
      projectDetails: t("yf.c2.project"),
      incomeLabel: t("card.incomeGoal"),
      incomeAmount: t("yf.c2.income"),
      paymentLink: "https://pages.greeninvoice.co.il/payments/links/36a58361-3ca5-4b61-88e8-d5279be62df6",
      buttonText: t("card.enrollButton"),
    },
    {
      id: 3,
      levelTitle: t("yf.c3.label"),
      role: t("yf.c3.title"),
      headerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      description: t("yf.c3.sub"),
      features: [
        t("yf.c3.f1"),
        t("yf.c3.f2"),
        t("yf.c3.f3"),
        t("yf.c3.f4"),
        t("yf.c3.f5"),
      ],
      projectLabel: t("card.signatureProject"),
      projectDetails: t("yf.c3.project"),
      incomeLabel: t("card.incomeGoal"),
      incomeAmount: t("yf.c3.income"),
      paymentLink: "https://pages.greeninvoice.co.il/payments/links/abe33628-819f-4886-89c4-626128f368f5",
      buttonText: t("card.enrollButton"),
    },
  ];
}

export function CardsSlider() {
  const { t, lang } = useLanguage();
  const cards = getCards(t);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth]   = useState(0);
  const [isRTL, setIsRTL]   = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    // 1. Detect RTL from the live document direction
    const rtl =
      document.documentElement.dir === "rtl" ||
      window.getComputedStyle(document.body).direction === "rtl";
    setIsRTL(rtl);

    // 2. Reset scroll position on every language change
    x.set(0);

    if (!containerRef.current) return;

    // 3. ResizeObserver recalculates width whenever content or fonts reflow
    const measure = () => {
      if (!containerRef.current) return;
      const w = Math.max(
        0,
        containerRef.current.scrollWidth - containerRef.current.offsetWidth,
      );
      setWidth(w);
    };

    measure(); // immediate pass

    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const scrollTo = (direction: "left" | "right") => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;

    let newX;
    if (isRTL) {
      // In RTL, moving to the logical "next" card (leftwards visually) means moving the container RIGHT (positive X)
      newX = direction === "right" ? currentX + scrollAmount : currentX - scrollAmount;
      // Clamp between 0 and positive width
      newX = Math.max(Math.min(newX, width), 0);
    } else {
      // LTR logic
      newX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;
      // Clamp between negative width and 0
      newX = Math.max(Math.min(newX, 0), -width);
    }

    animate(x, newX, { type: "spring", stiffness: 300, damping: 30, mass: 1 });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 relative group/slider">
      {/* Left arrow — only rendered when there is overflow to scroll */}
      {width > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scrollTo("left")}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95 text-foreground"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Right arrow */}
      {width > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scrollTo("right")}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95 text-foreground"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-4 py-8 -mx-4 -my-8"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag={width > 0 ? "x" : false}
          dragConstraints={
            isRTL
              ? { left: 0, right: width }   // RTL: x travels 0 → +width
              : { right: 0, left: -width }  // LTR: x travels 0 → -width
          }
          dragElastic={0.1}
          style={{ x }}
          className="flex gap-6 md:gap-8"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="min-w-[340px] md:min-w-[420px] max-w-[450px] flex flex-col"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <Card className="group relative h-full flex flex-col overflow-hidden rounded-3xl border-border/20 bg-card/10 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 hover:bg-card/20 hover:shadow-2xl hover:shadow-primary/5">

                {/* Header Section with Background Image */}
                <div className="relative p-10 min-h-[160px] flex flex-col justify-center items-center text-center border-b border-white/5 overflow-hidden">
                  {/* Background Image with slight zoom on hover */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${card.headerImage})` }}
                  />
                  {/* Gradient Overlay for Theme Match and Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background/95" />

                  {/* Text Content */}
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase mb-2 drop-shadow-lg">
                      {card.levelTitle}
                    </h2>
                    <p className="text-sm font-bold tracking-[0.2em] text-white uppercase drop-shadow-md">
                      {card.role}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col gap-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>

                  <ul className="space-y-3 flex-1">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-foreground/80 flex items-start gap-3">
                        <span className="text-[#E46C4E] mt-1 text-xs">●</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Section (Project & Income) */}
                <div className="p-8 pt-6 border-t border-white/5 bg-black/20 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#8C9AA9] uppercase tracking-wider mb-1">
                      {card.projectLabel}
                    </p>
                    <p className="text-sm text-foreground/90 font-medium">
                      {card.projectDetails}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <p className="text-xs font-semibold text-[#8C9AA9] uppercase tracking-wider">
                      {card.incomeLabel}
                    </p>
                    <p className="text-sm font-bold text-[#E46C4E]">
                      {card.incomeAmount}
                    </p>
                  </div>

                  <a
                    href={card.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 block text-center py-3 px-6 bg-[#E46C4E] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#d15b3d] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(228,108,78,0.4)] active:scale-95"
                  >
                    {card.buttonText}
                  </a>
                </div>

              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
