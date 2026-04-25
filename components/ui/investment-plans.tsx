"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";

const PLANS = [
  {
    id: "basic",
    nameKey: "inv.basic.name",
    sessionsKey: "inv.basic.sessions",
    price: "₪480",
    rateKey: "inv.basic.rate",
    discountKey: null as string | null,
    badgeKey: null as string | null,
    accent: "#2dd4bf",
    glow: "rgba(45,212,191,0.22)",
    border: "rgba(45,212,191,0.38)",
    borderWidth: "1px",
    headerBg: "linear-gradient(135deg,rgba(45,212,191,0.12) 0%,rgba(8,145,178,0.08) 100%)",
  },
  {
    id: "advanced",
    nameKey: "inv.adv.name",
    sessionsKey: "inv.adv.sessions",
    price: "₪900",
    rateKey: "inv.adv.rate",
    discountKey: null as string | null,
    badgeKey: null as string | null,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.22)",
    border: "rgba(168,85,247,0.45)",
    borderWidth: "1px",
    headerBg: "linear-gradient(135deg,rgba(168,85,247,0.12) 0%,rgba(109,40,217,0.08) 100%)",
  },
  {
    id: "elite",
    nameKey: "inv.elite.name",
    sessionsKey: "inv.elite.sessions",
    price: "₪1,400",
    rateKey: "inv.elite.rate",
    discountKey: "inv.elite.discount" as string | null,
    badgeKey: "inv.elite.badge" as string | null,
    accent: "#3de8ff",
    glow: "rgba(61,232,255,0.30)",
    border: "rgba(61,232,255,0.65)",
    borderWidth: "2px",
    headerBg: "linear-gradient(135deg,rgba(61,232,255,0.14) 0%,rgba(6,182,212,0.09) 100%)",
  },
];

export function InvestmentPlans() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const FEATURES = [t("inv.f1"), t("inv.f2"), t("inv.f3"), t("inv.f4"), t("inv.f5")];

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach((card) => {
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(55px)";
      }
    });

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        cards.forEach((card, i) => {
          if (!card) return;
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.16,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="yf-investment"
      style={{
        padding: "100px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#3de8ff",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          {t("inv.eyebrow")}
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem,5vw,3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          {t("inv.title")}
        </h2>
        <p
          style={{
            fontSize: "clamp(0.95rem,2vw,1.1rem)",
            color: "rgba(255,255,255,0.55)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {t("inv.subtitle")}
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{ willChange: "opacity,transform" }}
          >
            <Card
              style={{
                background:
                  "linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: `${plan.borderWidth} solid ${plan.border}`,
                borderRadius: 20,
                boxShadow:
                  plan.id === "elite"
                    ? `0 0 0 1px ${plan.border}, 0 0 40px ${plan.glow}, 0 8px 32px rgba(0,0,0,0.45)`
                    : `0 0 24px ${plan.glow}, 0 8px 28px rgba(0,0,0,0.35)`,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  plan.id === "elite"
                    ? `0 0 0 1px ${plan.border}, 0 0 60px ${plan.glow}, 0 16px 48px rgba(0,0,0,0.5)`
                    : `0 0 36px ${plan.glow}, 0 16px 40px rgba(0,0,0,0.45)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  plan.id === "elite"
                    ? `0 0 0 1px ${plan.border}, 0 0 40px ${plan.glow}, 0 8px 32px rgba(0,0,0,0.45)`
                    : `0 0 24px ${plan.glow}, 0 8px 28px rgba(0,0,0,0.35)`;
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  height: plan.id === "elite" ? 3 : 2,
                  background: `linear-gradient(90deg, transparent, ${plan.accent}, transparent)`,
                }}
              />

              <CardHeader style={{ padding: "28px 28px 20px", background: plan.headerBg }}>
                {/* Badge for Elite */}
                {plan.badgeKey && (
                  <div style={{ marginBottom: 12 }}>
                    <Badge
                      style={{
                        background: "linear-gradient(135deg,#ff8a50,#ff6420)",
                        color: "#fff",
                        fontSize: "0.65rem",
                        letterSpacing: "0.16em",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "none",
                        boxShadow: "0 2px 12px rgba(255,138,80,0.45)",
                      }}
                    >
                      {t(plan.badgeKey!)}
                    </Badge>
                  </div>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: plan.accent,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {t(plan.nameKey)}
                </p>

                {/* Sessions highlight */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: `rgba(${plan.id === "elite" ? "61,232,255" : plan.id === "advanced" ? "168,85,247" : "45,212,191"},0.1)`,
                    border: `1px solid ${plan.border}`,
                    borderRadius: 8,
                    padding: "5px 12px",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: plan.accent,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${plan.accent}`,
                    }}
                  />
                  <span style={{ fontSize: "0.82rem", color: plan.accent, fontWeight: 600 }}>
                    {t(plan.sessionsKey)}
                  </span>
                </div>

                {/* Pricing */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "clamp(2.4rem,5vw,3rem)",
                      fontWeight: 800,
                      color: "#ffffff",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {plan.price}
                  </span>
                  <div style={{ paddingBottom: 4 }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.4,
                      }}
                    >
                      {t(plan.rateKey)}
                    </div>
                    {plan.discountKey && (
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#4ade80",
                          fontWeight: 600,
                        }}
                      >
                        {t(plan.discountKey)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent style={{ padding: "20px 28px 28px" }}>
                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg,transparent,${plan.border},transparent)`,
                    marginBottom: 22,
                  }}
                />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {FEATURES.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.72)",
                        lineHeight: 1.45,
                      }}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width={15}
                        height={15}
                        style={{ flexShrink: 0, marginTop: 2 }}
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="7" stroke={plan.accent} strokeWidth="1.2" />
                        <path
                          d="M5 8l2 2 4-4"
                          stroke={plan.accent}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 10,
                    border: plan.id === "elite" ? "none" : `1.5px solid ${plan.border}`,
                    background:
                      plan.id === "elite"
                        ? "linear-gradient(135deg,#ff8a50 0%,#ff5f20 100%)"
                        : "transparent",
                    color: plan.id === "elite" ? "#ffffff" : plan.accent,
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow:
                      plan.id === "elite"
                        ? "0 4px 20px rgba(255,138,80,0.45)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    if (plan.id === "elite") {
                      btn.style.background = "linear-gradient(135deg,#ff9f6a 0%,#ff7040 100%)";
                      btn.style.boxShadow = "0 6px 28px rgba(255,138,80,0.6)";
                    } else {
                      btn.style.background = `rgba(${plan.id === "advanced" ? "168,85,247" : "45,212,191"},0.12)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    if (plan.id === "elite") {
                      btn.style.background = "linear-gradient(135deg,#ff8a50 0%,#ff5f20 100%)";
                      btn.style.boxShadow = "0 4px 20px rgba(255,138,80,0.45)";
                    } else {
                      btn.style.background = "transparent";
                    }
                  }}
                  onClick={() => {
                    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("inv.enroll")}
                </button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: "center",
          marginTop: 36,
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.33)",
          letterSpacing: "0.04em",
        }}
      >
        {t("inv.disclaimer")}
      </p>
    </section>
  );
}
