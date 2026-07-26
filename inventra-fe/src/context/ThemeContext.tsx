"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect, useCallback } from "react";

type Theme = "light" | "dark";
export type ColorTheme = "blue" | "emerald" | "rose" | "amber" | "violet";

type BrandPalette = {
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

const COLOR_PALETTES: Record<ColorTheme, BrandPalette> = {
  blue: {
    25: "#f2f7ff",
    50: "#ecf3ff",
    100: "#dde9ff",
    200: "#c2d6ff",
    300: "#9cb9ff",
    400: "#7592ff",
    500: "#465fff",
    600: "#3641f5",
    700: "#2a31d8",
    800: "#252dae",
    900: "#262e89",
    950: "#161950",
  },
  emerald: {
    25: "#f0fdf6",
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },
  rose: {
    25: "#fff5f6",
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519",
  },
  amber: {
    25: "#fffdf5",
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
  violet: {
    25: "#f9f5ff",
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065",
  },
};

export const COLOR_THEME_OPTIONS: { value: ColorTheme; label: string; hex: string }[] = [
  { value: "blue", label: "Blue", hex: "#465fff" },
  { value: "emerald", label: "Emerald", hex: "#10b981" },
  { value: "rose", label: "Rose", hex: "#f43f5e" },
  { value: "amber", label: "Amber", hex: "#f59e0b" },
  { value: "violet", label: "Violet", hex: "#8b5cf6" },
];

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyColorPalette(colorTheme: ColorTheme) {
  const palette = COLOR_PALETTES[colorTheme];
  const root = document.documentElement;

  const shades = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  for (const shade of shades) {
    root.style.setProperty(`--color-brand-${shade}`, palette[shade]);
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("blue");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme | null;
    const initialTheme = savedTheme || "light";
    const initialColorTheme = savedColorTheme || "blue";

    setTheme(initialTheme);
    setColorThemeState(initialColorTheme);
    applyColorPalette(initialColorTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setColorTheme = useCallback((newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    localStorage.setItem("colorTheme", newColorTheme);
    applyColorPalette(newColorTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
