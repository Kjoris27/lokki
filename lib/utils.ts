import type { Article, UnavailablePeriod } from "./types";
import { discountedPrice } from "./offer";

const DAY_MS = 24 * 60 * 60 * 1000;

// Booking inputs always represent Lomé time (UTC), regardless of the device timezone.
export function bookingDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(value)) return new Date(NaN);
  const date = new Date(
    value.length === 10 ? `${value}T00:00:00Z` : `${value}:00Z`,
  );
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, value.length) === value
    ? date
    : new Date(NaN);
}

export function calcDays(startDate: string, endDate: string): number {
  const diff =
    bookingDate(endDate).getTime() - bookingDate(startDate).getTime();
  return Number.isFinite(diff) && diff > 0 ? Math.ceil(diff / DAY_MS) : 0;
}

export function rentalEnd(startDate: string, days: number): string {
  const start = bookingDate(startDate).getTime();
  if (!Number.isFinite(start) || !Number.isSafeInteger(days) || days < 1)
    return "";
  const end = new Date(start + days * DAY_MS);
  return Number.isFinite(end.getTime()) ? end.toISOString().slice(0, 16) : "";
}

export function bookingNow(): string {
  return new Date().toISOString().slice(0, 16);
}

export function calcTotal(pricePerDay: number, days: number): number {
  return Number.isFinite(pricePerDay) &&
    pricePerDay >= 0 &&
    Number.isSafeInteger(days) &&
    days > 0 &&
    Number.isSafeInteger(discountedPrice(pricePerDay) * days)
    ? discountedPrice(pricePerDay) * days
    : 0;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F CFA";
}

export function formatDate(value: string): string {
  const date = bookingDate(value);
  if (!Number.isFinite(date.getTime())) return "Date invalide";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lome",
    ...(value.includes("T") ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function isDateRangeAvailable(
  article: Article,
  startDate: string,
  endDate: string,
): boolean {
  const start = bookingDate(startDate).getTime();
  const end = bookingDate(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return false;
  return article.unavailablePeriods.every((period) => {
    const blockedStart = bookingDate(period.start).getTime();
    // Date-only admin blocks include the entire last calendar day.
    const blockedEnd =
      bookingDate(period.end).getTime() +
      (period.end.length === 10 ? DAY_MS : 0);
    return (
      Number.isFinite(blockedStart) &&
      Number.isFinite(blockedEnd) &&
      blockedEnd > blockedStart &&
      (end <= blockedStart || start >= blockedEnd)
    );
  });
}

export function canBook(article: Article, start: string, end: string): boolean {
  const days = calcDays(start, end);
  return (
    article.kind === "game-pack" &&
    article.status === "active" &&
    bookingDate(start).getTime() >= Date.now() &&
    days >= article.conditions.minDuration &&
    rentalEnd(start, days) === end &&
    isDateRangeAvailable(article, start, end)
  );
}

export function getUnavailableDates(periods: UnavailablePeriod[]): string[] {
  const dates: string[] = [];
  for (const period of periods) {
    const start = bookingDate(period.start).getTime();
    const end = bookingDate(period.end).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
      continue;
    for (let day = start; day <= end; day += DAY_MS)
      dates.push(new Date(day).toISOString().slice(0, 10));
  }
  return dates;
}

export function generateCartId(): string {
  return crypto.randomUUID();
}
