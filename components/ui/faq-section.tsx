"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

function AccordionItem({
  q, a, index, isOpen, onToggle,
}: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.055 }}
    >
      <div
        style={{
          border: isOpen ? "1px solid rgba(255,138,80,0.35)" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          background: isOpen
            ? "linear-gradient(145deg,rgba(255,138,80,0.05) 0%,rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(145deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
          transition: "border-color 0.3s ease, background 0.3s ease",
          boxShadow: isOpen ? "0 0 28px rgba(255,138,80,0.08), 0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.2)",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ fontSize: "clamp(0.9rem,2vw,1rem)", fontWeight: 600, color: isOpen ? "#ff8a50" : "rgba(255,255,255,0.88)", letterSpacing: "0.01em", lineHeight: 1.4, transition: "color 0.25s ease", flex: 1 }}>
            {q}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
              border: `1px solid ${isOpen ? "rgba(255,138,80,0.5)" : "rgba(255,255,255,0.12)"}`,
              background: isOpen ? "rgba(255,138,80,0.12)" : "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.25s ease, background 0.25s ease",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="5.5" y1="1" x2="5.5" y2="10" stroke={isOpen ? "#ff8a50" : "rgba(255,255,255,0.5)"} strokeWidth="1.6" strokeLinecap="round" />
              <line x1="1" y1="5.5" x2="10" y2="5.5" stroke={isOpen ? "#ff8a50" : "rgba(255,255,255,0.5)"} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 24px 22px", borderTop: "1px solid rgba(255,138,80,0.12)", paddingTop: 18 }}>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75, letterSpacing: "0.01em" }}>
                  {a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const FAQS = [1,2,3,4,5,6,7,8,9,10].map(n => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }));

  return (
    <section id="yf-faq" style={{ padding: "96px 24px 80px", maxWidth: 820, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#ff8a50", fontWeight: 600, marginBottom: 14, opacity: 0.85 }}>
          {t("faq.eyebrow")}
        </p>
        <h2 style={{ fontSize: "clamp(1.8rem,5vw,2.9rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: 16, lineHeight: 1.1 }}>
          {t("faq.title")}
        </h2>
        <p style={{ fontSize: "clamp(0.88rem,2vw,1rem)", color: "rgba(255,255,255,0.42)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          {t("faq.subtitle")}{" "}
          <a href="/#waitlist" style={{ color: "#ff8a50", textDecoration: "none", borderBottom: "1px solid rgba(255,138,80,0.35)", paddingBottom: 1, transition: "border-color 0.2s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,138,80,0.8)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,138,80,0.35)")}
          >
            {t("faq.cta")}
          </a>
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} q={faq.q} a={faq.a} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(p => p === i ? null : i)} />
        ))}
      </div>
    </section>
  );
}
