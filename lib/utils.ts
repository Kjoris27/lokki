import { differenceInCalendarDays, parseISO, isWithinInterval, eachDayOfInterval } from "date-fns";
import { Article, UnavailablePeriod } from "./types";

export function calcDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const diff = differenceInCalendarDays(parseISO(endDate), parseISO(startDate));
  return diff < 1 ? 1 : diff + 1;
}

export function calcTotal(pricePerDay: number, days: number): number {
  return pricePerDay * days;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isDateRangeAvailable(
  article: Article,
  startDate: string,
  endDate: string
): boolean {
  if (!startDate || !endDate) return true;
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const requestedDays = eachDayOfInterval({ start, end });

  for (const period of article.unavailablePeriods) {
    const pStart = parseISO(period.start);
    const pEnd = parseISO(period.end);
    for (const day of requestedDays) {
      if (isWithinInterval(day, { start: pStart, end: pEnd })) {
        return false;
      }
    }
  }
  return true;
}

export function getUnavailableDates(periods: UnavailablePeriod[]): string[] {
  const dates: string[] = [];
  for (const period of periods) {
    const days = eachDayOfInterval({
      start: parseISO(period.start),
      end: parseISO(period.end),
    });
    days.forEach((d) => {
      dates.push(d.toISOString().split("T")[0]);
    });
  }
  return dates;
}

export function generateCartId(): string {
  return Math.random().toString(36).substring(2, 9);
}
