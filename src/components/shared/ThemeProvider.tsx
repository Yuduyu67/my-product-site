"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 初始化时从 localStorage 读取，避免在 effect 中 setState
  let initialTheme: Theme = "dark";
  try {
    const saved = localStorage.getItem("codementor-theme") as Theme | null;
    if (saved === "light" || saved === "dark") initialTheme = saved;
  } catch {}

  const [theme, setTheme] = useState<Theme>(initialTheme);

  // 切换时更新 html class 并持久化
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("codementor-theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
