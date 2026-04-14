"use client";

import { useLocale } from "@/context/LocaleProvider";
import Image from "next/image";

const LOCALES = [
  { value: "id" as const, label: "ID", image: '/images/country/country-09.png' },
  { value: "en" as const, label: "EN", image: '/images/country/country-10.png' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {LOCALES.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1.5px solid",
            borderColor: locale === l.value ? "#465fff" : "#e5e7eb",
            background: locale === l.value ? "#ecf3ff" : "#fff",
            color: locale === l.value ? "#3641f5" : "#6b7280",
            cursor: "pointer",
            fontWeight: locale === l.value ? 600 : 400,
          }}
        >
          <div className="flex items-center gap-4">
            <Image src={l.image} alt={l.label} width={24} height={24} />
            {l.label}
          </div>
        </button>
      ))}
    </div>
  );
}