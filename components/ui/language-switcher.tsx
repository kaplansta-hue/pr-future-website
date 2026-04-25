"use client";

import { ALL_LANGS, LANG_LABELS, useLanguage, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 8,
        padding: "3px 2px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {ALL_LANGS.map((l: Lang, i) => (
        <span key={l} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && (
            <span
              aria-hidden
              style={{
                width: 1,
                height: 12,
                background: "rgba(255,255,255,0.12)",
                display: "inline-block",
              }}
            />
          )}
          <button
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? "rgba(255,255,255,0.10)" : "transparent",
              border: "none",
              borderRadius: 5,
              color: lang === l ? "#ffffff" : "rgba(255,255,255,0.38)",
              fontSize: "0.62rem",
              fontWeight: lang === l ? 700 : 500,
              letterSpacing: "0.14em",
              padding: "4px 9px",
              cursor: "pointer",
              transition: "color 0.2s, background 0.2s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              if (l !== lang)
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.7)";
            }}
            onMouseLeave={(e) => {
              if (l !== lang)
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.38)";
            }}
            aria-label={`Switch to ${LANG_LABELS[l]}`}
          >
            {LANG_LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
