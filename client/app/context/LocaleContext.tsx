// context/LocaleContext.tsx
"use client";
import { createContext, useContext, useState } from "react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

type Locale = "en" | "hi";
const messages = { en, hi };

const LocaleContext = createContext<{
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  switchLocale: () => void;
}>({} as never);

function resolve(obj: Record<string, unknown>, key: string, params?: Record<string, string | number>): string {
  const value = key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj);
  let result = typeof value === "string" ? value : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(`{${k}}`, String(v));
    }
  }
  return result;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const t = (key: string, params?: Record<string, string | number>) =>
    resolve(messages[locale] as Record<string, unknown>, key, params);
  const switchLocale = () => setLocale((l) => (l === "en" ? "hi" : "en"));

  return (
    <LocaleContext.Provider value={{ locale, t, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);