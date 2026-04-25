"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { AdultsCardsSlider } from "@/components/ui/cards-slider-adults";
import { InvestmentPlans } from "@/components/ui/investment-plans";
import { SuccessStories } from "@/components/ui/success-stories";
import { FaqSection } from "@/components/ui/faq-section";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Adults() {
  const { t } = useLanguage();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

    const objObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = [...document.querySelectorAll(".obj-pillar")].indexOf(entry.target as HTMLElement);
            (entry.target as HTMLElement).style.transition = `opacity 0.7s ${idx * 0.12}s ease, transform 0.7s ${idx * 0.12}s cubic-bezier(0.23,1,0.32,1)`;
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            objObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll<HTMLElement>(".obj-pillar").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      objObs.observe(el);
    });

    document.querySelectorAll<HTMLElement>(".btn-yf, .nav-cta").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple-ring";
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${(e as MouseEvent).clientX - rect.left - size / 2}px;top:${(e as MouseEvent).clientY - rect.top - size / 2}px;`;
        btn.style.position = "relative";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const timeline = document.getElementById("ae-journey-timeline");
        const svgEl = document.getElementById("ae-timeline-svg") as SVGSVGElement | null;
        const pathBg = document.getElementById("ae-path-bg");
        const pathDraw = document.getElementById("ae-path-draw") as SVGPathElement | null;
        if (!timeline || !svgEl || !pathBg || !pathDraw) return;

        const rows = timeline.querySelectorAll<HTMLElement>(".step-row");
        const buildPath = () => {
          const svgRect = svgEl.parentElement!.getBoundingClientRect();
          const cx = svgRect.width / 2;
          const points: { x: number; y: number }[] = [];
          rows.forEach((row) => {
            const dotEl = row.querySelector<HTMLElement>(".step-dot")!;
            const dotRect = dotEl.getBoundingClientRect();
            points.push({ x: cx, y: dotRect.top - svgRect.top + dotRect.height / 2 });
          });
          if (points.length < 2) return null;
          let d = `M ${points[0].x} ${points[0].y}`;
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1], curr = points[i];
            const midY = (prev.y + curr.y) / 2;
            const offset = i % 2 === 0 ? -30 : 30;
            d += ` C ${prev.x + offset} ${midY}, ${curr.x - offset} ${midY}, ${curr.x} ${curr.y}`;
          }
          svgEl.setAttribute("viewBox", `0 0 ${svgRect.width} ${svgRect.height}`);
          svgEl.style.width = svgRect.width + "px";
          svgEl.style.height = svgRect.height + "px";
          pathBg.setAttribute("d", d);
          pathDraw.setAttribute("d", d);
          const len = pathDraw.getTotalLength();
          gsap.set(pathDraw, { strokeDasharray: len, strokeDashoffset: len });
          return len;
        };

        requestAnimationFrame(() => requestAnimationFrame(() => {
          const len = buildPath();
          if (!len) return;
          gsap.to(pathDraw, {
            strokeDashoffset: 0, ease: "none",
            scrollTrigger: { trigger: "#ae-journey", start: "top 75%", end: "bottom 60%", scrub: 1.2 },
          });
          rows.forEach((row) => {
            const dot = row.querySelector(".step-dot");
            const card = row.querySelector(".step-card");
            const trigger = { trigger: row, start: "top 72%", toggleActions: "play none none none" };
            if (dot) gsap.to(dot, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", scrollTrigger: trigger });
            if (card) gsap.to(card, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", delay: 0.12, scrollTrigger: trigger });
          });
        }));

        cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    });

    return () => {
      revealObs.disconnect();
      objObs.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <>
      {/* Fixed background */}
      <div className="bg-fixed-wrap">
        <img src="/uploads/bg.png" alt="P.R FUTURE background" />
        <div className="bg-fixed-overlay" />
      </div>

      {/* Nav */}
      <nav>
        <Link href="/" className="nav-logo">P.R FUTURE</Link>
        <ul className="nav-links">
          <li><a href="#ae-vision">{t("nav.vision")}</a></li>
          <li><a href="#ae-journey">{t("nav.journey")}</a></li>
          <li><a href="#ae-objectives">{t("nav.goals")}</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LanguageSwitcher />
          <Link href="/#waitlist" className="nav-cta">{t("nav.enrollNow")}</Link>
        </div>
      </nav>

      {/* Back */}
      <Link href="/" className="back-btn">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
          <path d="M12 7H2M7 2L2 7l5 5" />
        </svg>
        {t("nav.back")}
      </Link>

      {/* ── Hero ── */}
      <section className="yf-hero">
        <div className="yf-eyebrow">{t("ae.eyebrow")}</div>
        <h1 className="yf-title">{t("ae.title.line1")}<br />{t("ae.title.line2")}</h1>
        <p className="yf-subtitle">{t("ae.subtitle")}</p>
        <div className="yf-buttons">
          <a href="#ae-vision" className="btn-yf btn-yf-primary">{t("ae.btn1")}</a>
          <a href="#ae-vision" className="btn-yf">{t("ae.btn2")}</a>
        </div>
        <div className="scroll-indicator" style={{ bottom: 40 }}>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── What Differentiates Our Students? ── */}
      <section className="yf-vision" id="ae-vision">
        <p className="yf-mission">{t("ae.mission")}</p>
        <h2 className="yf-vision-title" style={{ whiteSpace: "pre-line" }}>{t("ae.vision.title")}</h2>
        <div className="pillars-list">
          {[
            { num: "01", title: t("ae.p01.title"), body: t("ae.p01.body") },
            { num: "02", title: t("ae.p02.title"), body: t("ae.p02.body") },
            { num: "03", title: t("ae.p03.title"), body: t("ae.p03.body") },
            { num: "04", title: t("ae.p04.title"), body: t("ae.p04.body") },
            { num: "05", title: t("ae.p05.title"), body: t("ae.p05.body") },
          ].map((p) => (
            <div className="pillar-item" key={p.num}>
              <div className="pillar-left">
                <span className="pillar-number">{p.num}</span>
                <div className="pillar-accent" />
              </div>
              <div className="pillar-right">
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-body">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="journey-section" id="ae-journey">
        <div className="journey-header">
          <div className="journey-eyebrow">{t("ae.journey.eyebrow")}</div>
          <h2 className="journey-title">{t("ae.journey.title")}</h2>
        </div>
        <div className="timeline" id="ae-journey-timeline" ref={timelineRef}>
          <div className="timeline-svg-wrap">
            <svg id="ae-timeline-svg" preserveAspectRatio="none">
              <path className="timeline-path-bg" id="ae-path-bg" />
              <path className="timeline-path-draw" id="ae-path-draw" />
            </svg>
          </div>
          {[
            { side: "left",  num: t("ae.s01.num"), title: t("ae.s01.title"), body: t("ae.s01.body") },
            { side: "right", num: t("ae.s02.num"), title: t("ae.s02.title"), body: t("ae.s02.body") },
            { side: "left",  num: t("ae.s03.num"), title: t("ae.s03.title"), body: t("ae.s03.body") },
            { side: "right", num: t("ae.s04.num"), title: t("ae.s04.title"), body: t("ae.s04.body") },
            { side: "left",  num: t("ae.s05.num"), title: t("ae.s05.title"), body: t("ae.s05.body") },
          ].map((step, i) => (
            <div className="step-row" key={i}>
              {step.side === "left" ? (
                <div className="step-card-wrap left">
                  <div className="step-card">
                    <div className="step-num">{step.num}</div>
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-body">{step.body}</p>
                  </div>
                </div>
              ) : <div className="step-card-wrap empty" />}
              <div className="step-center"><div className="step-dot" /></div>
              {step.side === "right" ? (
                <div className="step-card-wrap right">
                  <div className="step-card">
                    <div className="step-num">{step.num}</div>
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-body">{step.body}</p>
                  </div>
                </div>
              ) : <div className="step-card-wrap empty" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Central Goals ── */}
      <section className="objectives-section" id="ae-objectives">
        <div className="objectives-header">
          <div className="objectives-eyebrow">{t("ae.obj.eyebrow")}</div>
          <h2 className="objectives-title">{t("ae.obj.title")}</h2>
        </div>
        <div className="obj-grid">
          {[
            { cls: "obj-pillar-1", num: "01", title: t("ae.o01.title"), body: t("ae.o01.body") },
            { cls: "obj-pillar-2", num: "02", title: t("ae.o02.title"), body: t("ae.o02.body") },
            { cls: "obj-pillar-3", num: "03", title: t("ae.o03.title"), body: t("ae.o03.body") },
          ].map((p) => (
            <div className={`obj-pillar ${p.cls}`} key={p.num}>
              <div className="obj-line" />
              <div className="obj-index">{p.num}</div>
              <h3 className="obj-title">{p.title}</h3>
              <p className="obj-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Goals That Lead Us ── */}
      <section id="ae-goals-lead" style={{ padding: "80px 52px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(61,232,255,0.65)", marginBottom: 12 }}>
            {t("ae.goals.eyebrow")}
          </p>
          <h2 style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1 }}>
            {t("ae.goals.title")}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { num: "01", title: t("ae.g01.title"), body: t("ae.g01.body") },
            { num: "02", title: t("ae.g02.title"), body: t("ae.g02.body") },
            { num: "03", title: t("ae.g03.title"), body: t("ae.g03.body") },
            { num: "04", title: t("ae.g04.title"), body: t("ae.g04.body") },
          ].map((g) => (
            <div
              key={g.num}
              className="reveal"
              style={{
                background: "linear-gradient(145deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "32px 28px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(61,232,255,0.5)", marginBottom: 14, textTransform: "uppercase" }}>
                {g.num}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-0.01em" }}>
                {g.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.72, fontWeight: 300 }}>
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Project Showcase ── */}
      <AdultsProjectCarousel />

      {/* ── Manifesto ── */}
      <section className="manifesto-section" id="ae-manifesto">
        <div className="manifesto-header">
          <h2 className="manifesto-title" style={{ whiteSpace: "pre-line" }}>{t("ae.manifesto.title")}</h2>
          <p className="manifesto-intro" style={{ whiteSpace: "pre-line" }}>{t("ae.manifesto.intro")}</p>
        </div>
        <div className="manifesto-grid">
          {[
            { num: "01", title: t("ae.m01.title"), body: t("ae.m01.body") },
            { num: "02", title: t("ae.m02.title"), body: t("ae.m02.body") },
            { num: "03", title: t("ae.m03.title"), body: t("ae.m03.body") },
          ].map((p, i) => (
            <Fragment key={p.num}>
              {i > 0 && <div className="manifesto-divider" />}
              <div className="manifesto-col reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="manifesto-number">{p.num}</div>
                <h3 className="manifesto-principle" style={{ whiteSpace: "pre-line" }}>{p.title}</h3>
                <div className="manifesto-rule" />
                <p className="manifesto-body">{p.body}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── Program Levels ── */}
      <section className="program-levels-section" id="ae-levels">
        <AdultsCardsSlider />
      </section>

      {/* Investment Plans */}
      <InvestmentPlans />

      {/* Success Stories */}
      <SuccessStories />

      {/* FAQ */}
      <FaqSection />

      <footer style={{ marginTop: 0 }}>{t("footer")}</footer>
    </>
  );
}

/* ── Adults project carousel ──────────────────────────────────────── */
function AdultsProjectCarousel() {
  const { t, lang } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const projects = [
    { title: t("ae.proj1.title"), creator: "David, Marketing Director",  desc: t("ae.proj1.desc"), value: "35,000 ₪", tier: "val-high" },
    { title: t("ae.proj2.title"), creator: "Michal, Corporate Lawyer",    desc: t("ae.proj2.desc"), value: "25,000 ₪", tier: "val-mid" },
    { title: t("ae.proj3.title"), creator: "Oren, CEO",                   desc: t("ae.proj3.desc"), value: "20,000 ₪", tier: "val-mid" },
    { title: t("ae.proj4.title"), creator: "Tamar, Property Consultant",  desc: t("ae.proj4.desc"), value: "15,000 ₪", tier: "val-mid" },
    { title: t("ae.proj5.title"), creator: "Nir, Wealth Manager",         desc: t("ae.proj5.desc"), value: "45,000 ₪", tier: "val-elite" },
    { title: t("ae.proj6.title"), creator: "Shira, HR Director",          desc: t("ae.proj6.desc"), value: "18,000 ₪", tier: "val-mid" },
    { title: t("ae.proj7.title"), creator: "Dr. Yossi, Clinic Director",  desc: t("ae.proj7.desc"), value: "40,000 ₪", tier: "val-high" },
    { title: t("ae.proj8.title"), creator: "Ronit, Online Retailer",      desc: t("ae.proj8.desc"), value: "30,000 ₪", tier: "val-high" },
    { title: t("ae.proj9.title"), creator: "Alon, Business Consultant",   desc: t("ae.proj9.desc"), value: "12,000 ₪", tier: "val-low" },
  ];

  useEffect(() => {
    const stage = stageRef.current;
    const dotsEl = dotsRef.current;
    if (!stage || !dotsEl) return;

    const cardEls = projects.map((p, i) => {
      const el = document.createElement("div");
      el.className = "proj-card";
      el.dataset.idx = String(i);
      el.innerHTML = `
        <div class="proj-card-sheen"></div>
        <div class="card-corner-bl"></div><div class="card-corner-br"></div>
        <div class="card-brand-icon">
          <svg viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.4">
            <circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/>
            <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.5)" stroke="none"/>
          </svg>
        </div>
        <h3 class="card-proj-title">${p.title}</h3>
        <div class="card-creator">${p.creator}</div>
        <div class="card-desc-panel"><p>${p.desc}</p></div>
        <div class="card-valuation-btn ${p.tier}">${p.value}</div>
        <a class="card-explore" href="#">Explore Project &nbsp;→</a>
      `;
      stage.appendChild(el);
      return el;
    });

    projects.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "c-dot";
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });

    let current = 0;
    const posOf = (i: number) => {
      const diff = (i - current + projects.length) % projects.length;
      if (diff === 0) return "active";
      if (diff === 1) return "next";
      if (diff === projects.length - 1) return "prev";
      if (diff === 2) return "next2";
      if (diff === projects.length - 2) return "prev2";
      return "hidden";
    };
    const render = () => {
      cardEls.forEach((el, i) => { el.dataset.pos = posOf(i); });
      dotsEl.querySelectorAll(".c-dot").forEach((d, i) => d.classList.toggle("active", i === current));
    };
    const goTo = (idx: number) => { current = ((idx % projects.length) + projects.length) % projects.length; render(); };

    const prev = document.getElementById("ae-carousel-prev");
    const next = document.getElementById("ae-carousel-next");
    prev?.addEventListener("click", () => goTo(current - 1));
    next?.addEventListener("click", () => goTo(current + 1));
    stage.addEventListener("click", (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".proj-card");
      if (!card) return;
      if (card.dataset.pos === "prev") goTo(current - 1);
      if (card.dataset.pos === "next") goTo(current + 1);
    });

    render();
    return () => { stage.innerHTML = ""; dotsEl.innerHTML = ""; };
  // lang in deps ensures the carousel rebuilds when language changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section className="showcase-section" id="ae-showcase">
      <div className="showcase-header">
        <p className="showcase-quote">{t("ae.quote")}</p>
      </div>
      <div className="carousel-stage" id="ae-proj-carousel" ref={stageRef} />
      <div className="carousel-controls">
        <button className="carousel-btn" id="ae-carousel-prev" aria-label="Previous">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <div className="carousel-dots" id="ae-carousel-dots" ref={dotsRef} />
        <button className="carousel-btn" id="ae-carousel-next" aria-label="Next">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </div>
    </section>
  );
}
