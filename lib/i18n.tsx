"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang, HalalStatus, RecLabel, PriceTier } from "./types";

type Dict = Record<string, { id: string; en: string }>;

const DICT: Dict = {
  app_name: { id: "Batam Bites", en: "Batam Bites" },
  tagline: {
    id: "Peta kuliner saku untuk Batam",
    en: "Your pocket food map for Batam",
  },
  nav_home: { id: "Beranda", en: "Home" },
  nav_map: { id: "Peta", en: "Map" },
  nav_list: { id: "Daftar", en: "List" },
  nav_cat: { id: "Kategori", en: "Categories" },
  nav_saved: { id: "Tersimpan", en: "Saved" },
  nav_about: { id: "Tentang", en: "About" },

  search_ph: {
    id: "Cari tempat, menu, kategori…",
    en: "Search places, dishes, categories…",
  },
  near_ferry: { id: "Dekat Terminal Ferry", en: "Near Ferry Terminal" },
  must_try: { id: "Wajib Coba", en: "Must Try" },
  legendary: { id: "Legendaris Batam", en: "Batam Legends" },
  hits: { id: "Hits & Viral", en: "Trending & Viral" },
  browse_cat: { id: "Jelajahi Kategori", en: "Browse Categories" },
  see_all: { id: "Lihat semua", en: "See all" },
  view_map: { id: "Lihat Peta", en: "View Map" },
  view_list: { id: "Lihat Daftar", en: "View List" },
  filters: { id: "Filter", en: "Filters" },
  reset: { id: "Atur ulang", en: "Reset" },
  apply: { id: "Terapkan", en: "Apply" },
  sort: { id: "Urutkan", en: "Sort" },
  sort_featured: { id: "Pilihan", en: "Featured" },
  sort_rating: { id: "Rating tertinggi", en: "Top rated" },
  sort_nearest_ferry: { id: "Terdekat dari ferry", en: "Nearest to ferry" },
  sort_az: { id: "Nama A–Z", en: "Name A–Z" },
  category: { id: "Kategori", en: "Category" },
  area: { id: "Area / Kecamatan", en: "Area / District" },
  price: { id: "Harga", en: "Price" },
  halal_label: { id: "Status Halal", en: "Halal Status" },
  ferry: { id: "Terminal Ferry", en: "Ferry Terminal" },
  labels: { id: "Label", en: "Labels" },
  results: { id: "tempat", en: "places" },
  no_results: {
    id: "Tidak ada tempat yang cocok. Coba longgarkan filter.",
    en: "No places match. Try loosening the filters.",
  },
  open_now: { id: "Buka sekarang", en: "Open now" },
  closed_now: { id: "Tutup sekarang", en: "Closed now" },
  hours_unknown: { id: "Jam buka tidak tersedia", en: "Hours not listed" },
  navigate: { id: "Navigasi", en: "Navigate" },
  save: { id: "Simpan", en: "Save" },
  saved: { id: "Tersimpan", en: "Saved" },
  share: { id: "Bagikan", en: "Share" },
  signature: { id: "Menu Andalan", en: "Signature Dishes" },
  address: { id: "Alamat", en: "Address" },
  payment: { id: "Pembayaran", en: "Payment" },
  from_ferry: { id: "dari", en: "from" },
  approx_loc: {
    id: "Lokasi pin perkiraan — pakai tombol Navigasi untuk arah pasti.",
    en: "Pin location is approximate — use Navigate for exact directions.",
  },
  detail: { id: "Lihat detail", en: "View details" },
  about_title: { id: "Tentang Batam Bites", en: "About Batam Bites" },
  saved_empty: {
    id: "Belum ada tempat tersimpan. Tap ikon hati untuk menyimpan.",
    en: "No saved places yet. Tap the heart icon to save.",
  },
  saved_title: { id: "Tempat Tersimpan", en: "Saved Places" },
  reviews: { id: "ulasan", en: "reviews" },
  all_places: { id: "Semua Tempat", en: "All Places" },
  filter_active: { id: "filter aktif", en: "active" },
  clear: { id: "Hapus", en: "Clear" },
  price_note: {
    id: "Estimasi SGD berdasar kurs perkiraan.",
    en: "SGD estimate uses an approximate rate.",
  },
};

export const HALAL_LABEL: Record<HalalStatus, { id: string; en: string }> = {
  halal: { id: "Halal", en: "Halal" },
  "non-halal": { id: "Non-Halal", en: "Non-Halal" },
  "muslim-friendly": { id: "Ramah Muslim", en: "Muslim-Friendly" },
};

export const LABEL_LABEL: Record<RecLabel, { id: string; en: string }> = {
  legendaris: { id: "Legendaris", en: "Legendary" },
  hits: { id: "Hits", en: "Trending" },
  "wajib-coba": { id: "Wajib Coba", en: "Must Try" },
  "hidden-gem": { id: "Hidden Gem", en: "Hidden Gem" },
};

export const PRICE_HINT: Record<PriceTier, { id: string; en: string }> = {
  $: { id: "Hemat", en: "Cheap" },
  $$: { id: "Sedang", en: "Mid" },
  $$$: { id: "Premium", en: "Premium" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const stored = localStorage.getItem("bb_lang") as Lang | null;
    if (stored === "id" || stored === "en") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language) {
      setLangState(navigator.language.toLowerCase().startsWith("id") ? "id" : "en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("bb_lang", l);
  };

  const t = (key: keyof typeof DICT) => DICT[key]?.[lang] ?? String(key);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Pick a bilingual pair by current lang. */
export function pick(lang: Lang, pair: { id: string; en: string }): string {
  return pair[lang];
}
