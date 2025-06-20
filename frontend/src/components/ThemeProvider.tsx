import { useRef, type ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const didMount = useRef(false);

  useEffect(() => {
    // first render of theme is handled by script in the document itself, see initialTheme() below
    if (!didMount.current) {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      setTheme(storedTheme ?? defaultTheme);
      didMount.current = true;
      return;
    }
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // theme should be set by this point, but if not, fallback to system
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      if (systemTheme === "dark") {
        root.classList.add("dark");
      }
      console.log("System theme applied: ", systemTheme);
      return;
    }

    if (theme === "dark") {
      root.classList.add("dark");
    }
    if (theme === "light") {
      root.classList.add("light");
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  return context;
}
