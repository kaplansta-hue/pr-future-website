"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/* ── Static metadata — text comes from t() at render time ─────────── */
const TESTIMONIALS = [
  { type: "Student" as const, name: "Rotem, 15",  initials: "R", textKey: "testi.1.text"  },
  { type: "Student" as const, name: "Itay, 14",   initials: "I", textKey: "testi.2.text"  },
  { type: "Parent"  as const, name: "Yael M.",    initials: "Y", textKey: "testi.3.text"  },
  { type: "Parent"  as const, name: "Rachel K.",  initials: "R", textKey: "testi.4.text"  },
  { type: "Student" as const, name: "Gal, 16",    initials: "G", textKey: "testi.5.text"  },
  { type: "Student" as const, name: "Ori, 16",    initials: "O", textKey: "testi.6.text"  },
  { type: "Parent"  as const, name: "Dani L.",    initials: "D", textKey: "testi.7.text"  },
  { type: "Student" as const, name: "Shir, 15",   initials: "S", textKey: "testi.8.text"  },
  { type: "Parent"  as const, name: "Moshe T.",   initials: "M", textKey: "testi.9.text"  },
  { type: "Student" as const, name: "Ariel, 17",  initials: "A", textKey: "testi.10.text" },
];

const ROW_1 = TESTIMONIALS.slice(0, 5);
const ROW_2 = TESTIMONIALS.slice(5, 10);

/* ── Helpers ──────────────────────────────────────────────────────── */
const STUDENT_THEME = { color: "#3de8ff", bg: "rgba(61,232,255,0.10)", border: "rgba(61,232,255,0.28)" };
const PARENT_THEME  = { color: "#a855f7", bg: "rgba(168,85,247,0.10)", border: "rgba(168,85,247,0.28)" };

/* ── Single card ──────────────────────────────────────────────────── */
function TestiCard({ item, badgeLabel, getText }: { item: (typeof TESTIMONIALS)[number]; badgeLabel: string; getText: (k: string) => string }) {
  const th = item.type === "Student" ? STUDENT_THEME : PARENT_THEME;
  return (
    <div
      style={{
        flexShrink: 0, width: 340,
        background: "linear-gradient(145deg,rgba(255,255,255,0.038) 0%,rgba(255,255,255,0.012) 100%)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18,
        padding: "26px 28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
        display: "flex", flexDirection: "column", gap: 16, margin: "0 12px", userSelect: "none",
      }}
    >
      <Quote size={18} style={{ color: th.color, opacity: 0.6, flexShrink: 0 }} strokeWidth={1.6} />
      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, flexGrow: 1, fontStyle: "normal", letterSpacing: "0.01em" }}>
        &ldquo;{getText(item.textKey)}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${th.color}30, ${th.color}10)`, border: `1px solid ${th.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: th.color, flexShrink: 0, letterSpacing: "0.04em" }}>
          {item.initials}
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", flex: 1, letterSpacing: "0.02em" }}>
          {item.name}
        </span>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: th.color, background: th.bg, border: `1px solid ${th.border}`, borderRadius: 6, padding: "3px 9px", flexShrink: 0 }}>
          {badgeLabel}
        </span>
      </div>
    </div>
  );
}

/* ── Marquee row ──────────────────────────────────────────────────── */
function MarqueeRow({ items, direction, duration, studentLabel, parentLabel, getText }: {
  items: typeof TESTIMONIALS; direction: "left" | "right"; duration: number;
  studentLabel: string; parentLabel: string; getText: (k: string) => string;
}) {
  const doubled = [...items, ...items];
  const anim = direction === "left" ? { x: ["0%", "-50%"] } : { x: ["-50%", "0%"] };
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div animate={anim} transition={{ duration, ease: "linear", repeat: Infinity }} style={{ display: "flex", width: "max-content" }} whileHover={{ animationPlayState: "paused" }}>
        {doubled.map((item, i) => (
          <TestiCard key={`${item.name}-${i}`} item={item} badgeLabel={item.type === "Student" ? studentLabel : parentLabel} getText={getText} />
        ))}
      </motion.div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */
export function SuccessStories() {
  const { t } = useLanguage();
  const studentLabel = t("stories.badge.student");
  const parentLabel  = t("stories.badge.parent");
  return (
    <section
      id="yf-stories"
      style={{
        padding: "100px 0 90px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle ambient glow behind the section */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(61,232,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 56, padding: "0 24px" }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#3de8ff",
            fontWeight: 600,
            marginBottom: 14,
            opacity: 0.7,
          }}
        >
          {t("stories.eyebrow")}
        </p>
        <h2
          style={{
            fontSize: "clamp(1.9rem,5vw,3rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: 14,
            lineHeight: 1.08,
          }}
        >
          {t("stories.title")}
        </h2>
        <p
          style={{
            fontSize: "clamp(0.9rem,2vw,1.05rem)",
            color: "rgba(255,255,255,0.45)",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          {t("stories.subtitle")}
        </p>
      </motion.div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <MarqueeRow items={ROW_1} direction="left"  duration={50} studentLabel={studentLabel} parentLabel={parentLabel} getText={t} />
        <MarqueeRow items={ROW_2} direction="right" duration={58} studentLabel={studentLabel} parentLabel={parentLabel} getText={t} />
      </motion.div>

      {/* Edge fade masks */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, #05030e 0%, transparent 12%, transparent 88%, #05030e 100%)",
        }}
      />
    </section>
  );
}
