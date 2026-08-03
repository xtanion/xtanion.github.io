"use client"

import * as React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "theme"
export const DEFAULT_THEME: Theme = "dark"

/**
 * Runs before first paint via a blocking <script> in <head>, so the class is
 * already on <html> by the time React hydrates. Kept in sync with applyTheme.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t="${DEFAULT_THEME}";document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch(e){document.documentElement.classList.add("${DEFAULT_THEME}")}})()`

type ThemeContextValue = {
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function normalize(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : DEFAULT_THEME
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>()

  useEffect(() => {
    setThemeState(normalize(localStorage.getItem(THEME_STORAGE_KEY)))
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return
      const next = normalize(event.newValue)
      setThemeState(next)
      applyTheme(next)
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // storage disabled (private mode): theme still applies for this session
    }
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
