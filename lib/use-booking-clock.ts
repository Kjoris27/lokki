"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

// Stable server markup; refresh form validity as the requested time approaches.
export function useBookingClock() {
  const minute = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return minute === null
    ? undefined
    : new Date(minute * 60_000).toISOString().slice(0, 16);
}
