"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Home() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    document.querySelectorAll<HTMLElement>(".glass-card").forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-8px) scale(1.015) rotateY(${cx * 8}deg) rotateX(${-cy * 6}deg)`;
      };
      const onLeave = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    document.querySelectorAll<HTMLElement>(".btn-submit, .nav-cta").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple-ring";
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${(e as MouseEvent).clientX - rect.left - size / 2}px;top:${(e as MouseEvent).clientY - rect.top - size / 2}px;`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    return () => observer.disconnect();
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
          <li><a href="#vision">{t("nav.academy")}</a></li>
          <li><a href="#programs">{t("nav.programs")}</a></li>
          <li><a href="#waitlist">{t("nav.enroll")}</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LanguageSwitcher />
          <a href="#waitlist" className="nav-cta">{t("nav.cta")}</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">{t("home.hero.title")}</h1>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Vision */}
      <section className="vision" id="vision">
        <div className="vision-inner">
          <h2 className="vision-title reveal">
            <span>{t("home.vision.title")}</span>
          </h2>
          <div className="vision-divider reveal reveal-delay-1" />
          <p className="vision-body reveal reveal-delay-2">
            {t("home.vision.body1")}<br /><br />
            {t("home.vision.body2")}
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="programs" id="programs">
        <div className="programs-header reveal">
          <div className="programs-eyebrow">{t("home.programs.eyebrow")}</div>
          <h2 className="programs-title">{t("home.programs.title")}</h2>
        </div>
        <div className="cards-grid" ref={cardsRef}>
          {/* Young Founders */}
          <Link
            href="/young-founders"
            className="glass-card card-cyan reveal reveal-delay-1"
            style={{ textDecoration: "none" }}
          >
            <div className="card-tag">{t("card.yf.tag")}</div>
            <div className="card-title">{t("card.yf.title")}</div>
            <div className="card-audience">{t("card.yf.audience")}</div>
            <span className="card-cta">{t("card.yf.cta")}</span>
          </Link>

          {/* AI Experts */}
          <Link
            href="/adults"
            className="glass-card card-orange reveal reveal-delay-2"
            style={{ textDecoration: "none" }}
          >
            <div className="card-tag">{t("card.ae.tag")}</div>
            <div className="card-title">{t("card.ae.title")}</div>
            <div className="card-audience">{t("card.ae.audience")}</div>
            <span className="card-cta">{t("card.ae.cta")}</span>
          </Link>

          {/* Business AI */}
          <div className="glass-card card-violet reveal reveal-delay-3">
            <div className="card-tag">{t("card.biz.tag")}</div>
            <div className="card-title">{t("card.biz.title")}</div>
            <div className="card-audience">{t("card.biz.audience")}</div>
            <a href="#waitlist" className="card-cta">{t("card.biz.cta")}</a>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="waitlist-section" id="waitlist">
        <div className="waitlist-panel reveal">
          <h2 className="waitlist-title">{t("waitlist.title")}</h2>
          <p className="waitlist-sub">{t("waitlist.sub")}</p>
          <div className="waitlist-form">
            <input
              type="email"
              className="glass-input"
              placeholder={t("waitlist.placeholder")}
            />
            <button className="btn-submit">{t("waitlist.button")}</button>
          </div>
        </div>
      </section>

      <footer>{t("footer")}</footer>
    </>
  );
}
