import type { Lang } from "./types";

/** Approximate IDR per 1 SGD (mid-2026 ballpark, for rough guidance only). */
export const SGD_RATE = 12000;

/** Parse the largest IDR figure from a price string like "Rp 15.000–35.000". */
function maxIdr(priceIdr: string): number | null {
  const nums = priceIdr
    .replace(/\./g, "")
    .match(/\d{4,}/g);
  if (!nums || nums.length === 0) return null;
  return Math.max(...nums.map((n) => parseInt(n, 10)));
}

/** Rough "~S$X" estimate from a price range string. */
export function sgdEstimate(priceIdr: string): string | null {
  const max = maxIdr(priceIdr);
  if (!max) return null;
  const sgd = max / SGD_RATE;
  if (sgd < 10) return `~S$${sgd.toFixed(1)}`;
  return `~S$${Math.round(sgd)}`;
}

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/**
 * Best-effort "open now" check from a free-text hours string.
 * Supports formats like "10.00–21.00", "07.00-13.00", "24 jam".
 * Returns null when it cannot be determined.
 */
export function isOpenNow(hours: string, now = new Date()): boolean | null {
  if (!hours) return null;
  const h = hours.toLowerCase();
  if (h.includes("24 jam") || h.includes("24 hours") || h.includes("24/7"))
    return true;

  const m = hours.match(
    /(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/,
  );
  if (!m) return null;

  const open = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  let close = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
  const cur = now.getHours() * 60 + now.getMinutes();

  // Overnight range, e.g. 16.00–01.00
  if (close <= open) {
    close += 24 * 60;
    if (cur < open) return cur + 24 * 60 < close;
    return cur < close;
  }
  return cur >= open && cur < close;
}

export function todayLabel(now = new Date(), lang: Lang = "id"): string {
  if (lang === "en") {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  }
  return DAY_NAMES[now.getDay()];
}

export function formatRating(rating: number | null): string {
  if (rating == null) return "—";
  return rating.toFixed(1);
}

export function formatReviews(reviews: number | null): string {
  if (reviews == null) return "";
  if (reviews >= 1000) return `${(reviews / 1000).toFixed(1)}k`;
  return String(reviews);
}
