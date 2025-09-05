import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "hi";

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    app_title: "SPOC Civic Issue Portal",
    tagline: "Report. Resolve. Renew.",
    landing_intro:
      "A single point of contact to report civic issues and track their resolution.",
    get_started: "Get Started",
    login: "Login",
    register: "Register",
    username: "Username",
    email: "Email",
    password: "Password",
    role: "Role",
    department: "Department",
    admin: "Admin",
    staff: "Staff",
    user: "Citizen",
    or: "or",
  },
  hi: {
    app_title: "एसपीओसी नागरिक समस्या पोर्टल",
    tagline: "रिपोर्ट करें. समाधान करें. नवीनीकरण क���ें.",
    landing_intro:
      "नागरिक समस्याओं की रिपोर्ट और समाधान की ट्रैकिंग के लिए एकल संपर्क बिंदु।",
    get_started: "शुरू करें",
    login: "लॉगिन",
    register: "पंजीकरण",
    username: "उपयोगकर्ता नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    role: "भूमिका",
    department: "विभाग",
    admin: "प्रशासक",
    staff: "कर्मचारी",
    user: "नागरिक",
    or: "या",
  },
};

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
} | null>(null);

const LANG_KEY = "spoc_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const raw = localStorage.getItem(LANG_KEY) as Locale | null;
    if (raw) setLocale(raw);
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, locale);
  }, [locale]);

  const t = (key: string) => STRINGS[locale][key] ?? key;

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
