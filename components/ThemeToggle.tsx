"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
  toggleTheme,
} from "@/lib/theme";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const label =
    theme === null
      ? "Changer le thème"
      : theme === "dark"
        ? "Activer le thème clair"
        : "Activer le thème sombre";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
    >
      <Moon size={18} className="theme-moon" aria-hidden="true" />
      <Sun size={18} className="theme-sun" aria-hidden="true" />
    </button>
  );
}
