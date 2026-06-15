"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brick text-white shadow-[0_4px_12px_rgba(226,85,43,0.4)]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
              fill="currentColor"
            />
            <circle cx="12" cy="9" r="2.6" fill="#0e7c7b" />
          </svg>
        </span>
        <span className="text-[17px] font-extrabold tracking-tight">
          Batam<span className="text-brick">Bites</span>
        </span>
      </Link>

      <div className="flex items-center rounded-full border border-line bg-card p-0.5 text-xs font-bold">
        {(["id", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-full px-2.5 py-1 transition ${
              lang === l ? "bg-ink text-white" : "text-muted"
            }`}
            aria-pressed={lang === l}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
