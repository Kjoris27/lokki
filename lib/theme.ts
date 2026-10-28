export type Theme = "light" | "dark";

const STORAGE_KEY = "lokki-theme";
const CHANGE_EVENT = "lokki-theme-change";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";
let memoryChoice: Theme | null = null;

// Run in the head before the first paint, including when storage is unavailable.
// Only this trusted constant is injected; no user content is interpolated.
export const THEME_INIT_SCRIPT = `(()=>{let t;try{t=localStorage.getItem("${STORAGE_KEY}")}catch{}if(t!=="light"&&t!=="dark")t=window.matchMedia("${MEDIA_QUERY}").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;

function preference(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : memoryChoice;
  } catch {
    return memoryChoice;
  }
}

export function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function getServerThemeSnapshot(): null {
  return null;
}

export function toggleTheme() {
  const theme = getThemeSnapshot() === "dark" ? "light" : "dark";
  memoryChoice = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The control still works for this visit in private or storage-restricted browsers.
  }
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia(MEDIA_QUERY);
  const sync = () => {
    document.documentElement.dataset.theme =
      preference() ?? (media.matches ? "dark" : "light");
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    memoryChoice =
      event.newValue === "light" || event.newValue === "dark"
        ? event.newValue
        : null;
    sync();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", sync);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", sync);
  };
}
