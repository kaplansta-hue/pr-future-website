"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CardsSlider } from "@/components/ui/cards-slider-shadcnui";
import { InvestmentPlans } from "@/components/ui/investment-plans";
import { SuccessStories } from "@/components/ui/success-stories";
import { FaqSection } from "@/components/ui/faq-section";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

// Lazy-load GSAP only on client
let gsapLoaded = false;

export default function YoungFounders() {
  const { t } = useLanguage();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll reveal
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

    // Objective pillars stagger
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

    // Liquid ripple on buttons
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

    // GSAP timeline animation
    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const timeline = document.getElementById("journey-timeline");
        const svgEl = document.getElementById("timeline-svg") as SVGSVGElement | null;
        const pathBg = document.getElementById("t-path-bg");
        const pathDraw = document.getElementById("t-path-draw") as SVGPathElement | null;
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
            scrollTrigger: { trigger: "#yf-journey", start: "top 75%", end: "bottom 60%", scrub: 1.2 }
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
          <li><a href="#yf-vision">{t("nav.vision")}</a></li>
          <li><a href="#yf-journey">{t("nav.journey")}</a></li>
          <li><a href="#yf-objectives">{t("nav.goals")}</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LanguageSwitcher />
          <Link href="/#waitlist" className="nav-cta">{t("nav.enrollNow")}</Link>
        </div>
      </nav>

      {/* Back button */}
      <Link href="/" className="back-btn">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
          <path d="M12 7H2M7 2L2 7l5 5" />
        </svg>
        {t("nav.back")}
      </Link>

      {/* YF Hero */}
      <section className="yf-hero">
        <motion.div
          className="yf-eyebrow font-black tracking-wide"
          style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0 }}
        >
          {t("yf.eyebrow")}
        </motion.div>
        <motion.h1
          className="yf-title font-black tracking-wide"
          style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          {t("yf.title.line1")}<br />{t("yf.title.line2")}
        </motion.h1>
        <motion.p
          className="yf-subtitle font-black tracking-wide"
          style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        >
          {t("yf.subtitle")}
        </motion.p>
        <motion.div
          className="yf-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
        >
          <a href="#yf-vision" className="btn-yf btn-yf-primary">{t("yf.btn1")}</a>
          <a href="#yf-vision" className="btn-yf">{t("yf.btn2")}</a>
        </motion.div>
        <div className="scroll-indicator" style={{ bottom: 40 }}>
          <div className="scroll-line" />
        </div>
      </section>

      {/* YF Vision */}
      <section className="yf-vision" id="yf-vision">
        <motion.p
          className="yf-mission font-black tracking-wide"
          style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {t("yf.mission")}
        </motion.p>
        <motion.h2
          className="yf-vision-title font-black tracking-wide"
          style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900, whiteSpace: "pre-line" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        >
          {t("yf.vision.title")}
        </motion.h2>
        <div className="pillars-list">
          {[
            { num: "01", title: t("yf.p01.title"), body: t("yf.p01.body"), slideX: 120 },
            { num: "02", title: t("yf.p02.title"), body: t("yf.p02.body"), slideX: -120 },
            { num: "03", title: t("yf.p03.title"), body: t("yf.p03.body"), slideX: 120 },
          ].map((p, i) => (
            <motion.div
              className="pillar-item"
              key={p.num}
              initial={{ opacity: 0, x: p.slideX }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <div className="pillar-left">
                <span className="pillar-number font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.num}</span>
                <div className="pillar-accent" />
              </div>
              <div className="pillar-right">
                <h3 className="pillar-title font-black tracking-wide" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.title}</h3>
                <p className="pillar-body font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="journey-section" id="yf-journey">
        <div className="journey-header">
          <motion.div
            className="journey-eyebrow font-black tracking-wide"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {t("yf.journey.eyebrow")}
          </motion.div>
          <motion.h2
            className="journey-title font-black tracking-wide"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          >
            {t("yf.journey.title")}
          </motion.h2>
        </div>
        <div className="timeline" id="journey-timeline" ref={timelineRef}>
          <div className="timeline-svg-wrap">
            <svg id="timeline-svg" preserveAspectRatio="none">
              <path className="timeline-path-bg" id="t-path-bg" />
              <path className="timeline-path-draw" id="t-path-draw" />
            </svg>
          </div>
          {[
            { side: "left",  num: t("yf.s01.num"), title: t("yf.s01.title"), body: t("yf.s01.body") },
            { side: "right", num: t("yf.s02.num"), title: t("yf.s02.title"), body: t("yf.s02.body") },
            { side: "left",  num: t("yf.s03.num"), title: t("yf.s03.title"), body: t("yf.s03.body") },
            { side: "right", num: t("yf.s04.num"), title: t("yf.s04.title"), body: t("yf.s04.body") },
            { side: "left",  num: t("yf.s05.num"), title: t("yf.s05.title"), body: t("yf.s05.body") },
          ].map((step, i) => (
            <div className="step-row" key={i}>
              {step.side === "left" ? (
                <div className="step-card-wrap left">
                  <div className="step-card">
                    <div className="step-num font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.num}</div>
                    <h4 className="step-title font-black tracking-wide" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.title}</h4>
                    <p className="step-body font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.body}</p>
                  </div>
                </div>
              ) : <div className="step-card-wrap empty" />}
              <div className="step-center"><div className="step-dot" /></div>
              {step.side === "right" ? (
                <div className="step-card-wrap right">
                  <div className="step-card">
                    <div className="step-num font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.num}</div>
                    <h4 className="step-title font-black tracking-wide" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.title}</h4>
                    <p className="step-body font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{step.body}</p>
                  </div>
                </div>
              ) : <div className="step-card-wrap empty" />}
            </div>
          ))}
        </div>
      </section>

      {/* Core Objectives */}
      <section className="objectives-section" id="yf-objectives">
        <div className="objectives-header">
          <motion.div
            className="objectives-eyebrow font-black tracking-wide"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {t("yf.obj.eyebrow")}
          </motion.div>
          <motion.h2
            className="objectives-title font-black tracking-wide"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          >
            {t("yf.obj.title")}
          </motion.h2>
        </div>
        <div className="obj-grid">
          {[
            { cls: "obj-pillar-1", num: "01", title: t("yf.o01.title"), body: t("yf.o01.body") },
            { cls: "obj-pillar-2", num: "02", title: t("yf.o02.title"), body: t("yf.o02.body") },
            { cls: "obj-pillar-3", num: "03", title: t("yf.o03.title"), body: t("yf.o03.body") },
          ].map((p) => (
            <div className={`obj-pillar ${p.cls}`} key={p.num}>
              <div className="obj-line" />
              <div className="obj-index font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.num}</div>
              <h3 className="obj-title font-black tracking-wide" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.title}</h3>
              <p className="obj-body font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Showcase — vanilla carousel */}
      <ProjectCarousel />

      {/* Manifesto */}
      <section className="manifesto-section" id="yf-manifesto">
        <div className="manifesto-header">
          <motion.h2
            className="manifesto-title font-black tracking-wide"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900, whiteSpace: "pre-line" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {t("yf.manifesto.title")}
          </motion.h2>
          <motion.p
            className="manifesto-intro font-black"
            style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900, whiteSpace: "pre-line" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          >
            {t("yf.manifesto.intro")}
          </motion.p>
        </div>
        <div className="manifesto-grid">
          {[
            { num: "01", title: t("yf.m01.title"), body: t("yf.m01.body") },
            { num: "02", title: t("yf.m02.title"), body: t("yf.m02.body") },
            { num: "03", title: t("yf.m03.title"), body: t("yf.m03.body") },
          ].map((p, i) => (
            <Fragment key={p.num}>
              {i > 0 && <div className="manifesto-divider" />}
              <motion.div
                className="manifesto-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 }}
              >
                <div className="manifesto-number font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.num}</div>
                <h3 className="manifesto-principle font-black tracking-wide" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900, whiteSpace: "pre-line" }}>{p.title}</h3>
                <div className="manifesto-rule" />
                <p className="manifesto-body font-black" style={{ fontFamily: "'Calibri', system-ui, sans-serif", fontWeight: 900 }}>{p.body}</p>
              </motion.div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* Program Levels — CardsSlider */}
      <motion.section
        className="program-levels-section"
        id="yf-levels"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <CardsSlider />
      </motion.section>

      {/* Investment Plans */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <InvestmentPlans />
      </motion.div>

      {/* Success Stories */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <SuccessStories />
      </motion.div>

      {/* FAQ — final section before footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <FaqSection />
      </motion.div>

      <footer style={{ marginTop: 0 }}>{t("footer")}</footer>
    </>
  );
}

/* ── Vanilla project carousel (self-contained) ── */
function ProjectCarousel() {
  const { t, lang } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const projects = [
    { title: t("yf.proj1.title"), creator: "Daniel, 16", desc: t("yf.proj1.desc"), value: "15,000 ₪", tier: "val-high" },
    { title: t("yf.proj2.title"), creator: "Noa, 15",    desc: t("yf.proj2.desc"), value: "5,000 ₪",  tier: "val-low" },
    { title: t("yf.proj3.title"), creator: "Maya, 15",   desc: t("yf.proj3.desc"), value: "10,000 ₪", tier: "val-mid" },
    { title: t("yf.proj4.title"), creator: "Yonatan, 17",desc: t("yf.proj4.desc"), value: "15,000 ₪", tier: "val-high" },
    { title: t("yf.proj5.title"), creator: "Shira, 16",  desc: t("yf.proj5.desc"), value: "5,000 ₪",  tier: "val-low" },
    { title: t("yf.proj6.title"), creator: "Omri, 14",   desc: t("yf.proj6.desc"), value: "15,000 ₪", tier: "val-high" },
    { title: t("yf.proj7.title"), creator: "Ariel, 15",  desc: t("yf.proj7.desc"), value: "3,000 ₪",  tier: "val-low" },
    { title: t("yf.proj8.title"), creator: "Tal, 16",    desc: t("yf.proj8.desc"), value: "50,000 ₪", tier: "val-elite" },
    { title: t("yf.proj9.title"), creator: "Guy, 15",    desc: t("yf.proj9.desc"), value: "5,000 ₪",  tier: "val-low" },
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

    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
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
    <section className="showcase-section" id="yf-showcase">
      <div className="showcase-header">
        <p className="showcase-quote">{t("yf.quote")}</p>
      </div>
      <div className="carousel-stage" id="proj-carousel" ref={stageRef} />
      <div className="carousel-controls">
        <button className="carousel-btn" id="carousel-prev" aria-label="Previous">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <div className="carousel-dots" id="carousel-dots" ref={dotsRef} />
        <button className="carousel-btn" id="carousel-next" aria-label="Next">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </div>
    </section>
  );
}
