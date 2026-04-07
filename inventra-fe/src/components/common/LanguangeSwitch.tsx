"use client";

import { useLocale } from "@/context/LocaleProvider";
import Image from "next/image";

const LOCALES = [
  { value: "id" as const, label: "ID", image : 'https://www.flaticon.com/free-icons/indonesia-flag' },
  { value: "en" as const, label: "EN", image : 'https://www.flaticon.com/free-icons/united-states' },
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
          <Image src={l.image} alt={l.label} width={24} height={24} />
          {l.label}
        </button>
      ))}
    </div>
  );
}