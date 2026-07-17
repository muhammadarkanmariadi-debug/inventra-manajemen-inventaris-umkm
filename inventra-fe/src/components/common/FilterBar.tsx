import { useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabOption {
  label: string;
  value: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectConfig {
  label: string;
  key: string;
  options: SelectOption[];
}

export interface FilterValues {
  tab: string;
  selects: Record<string, string>;
  search: string;
}

export interface FilterBarProps {
  tabs?: TabOption[];
  selects?: SelectConfig[];
  searchPlaceholder?: string;
  onFilterChange?: (filters: FilterValues) => void;
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface FilterSelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ActiveFilterBadgeProps {
  label: string;
  onRemove: () => void;
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-dm-sans",
        "border transition-all duration-150 outline-none whitespace-nowrap cursor-pointer",
        active
          ? "border-brand-500 bg-brand-50 text-brand-600 font-semibold ring-2 ring-brand-100 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-900"
          : "border-gray-200 bg-white text-gray-500 font-normal shadow-sm hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-600 dark:hover:text-brand-400",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ─── FilterSelect ─────────────────────────────────────────────────────────────

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  // react-select styles are JS objects, so we use getComputedStyle to read
  // Tailwind CSS variables at runtime for consistent theming.
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const selectStyles: StylesConfig<SelectOption> = {
    container: (base) => ({ ...base, minWidth: 140 }),
    control: (base, state) => ({
      ...base,
      fontFamily: "inherit",
      fontSize: "13px",
      borderRadius: "10px",
      borderColor: state.isFocused
        ? "var(--color-brand-400)"
        : isDark
        ? "#374151"
        : "#e5e7eb",
      borderWidth: "1.5px",
      boxShadow: state.isFocused
        ? "0 0 0 3px var(--color-brand-100)"
        : "none",
      minHeight: "38px",
      cursor: "pointer",
      backgroundColor: isDark ? "#111827" : "#ffffff",
      "&:hover": {
        borderColor: "var(--color-brand-300)",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      fontSize: "13px",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "var(--color-brand-300)" : "var(--color-brand-700)",
      fontWeight: 500,
      fontSize: "13px",
    }),
    option: (base, state) => ({
      ...base,
      fontFamily: "inherit",
      fontSize: "13px",
      backgroundColor: state.isSelected
        ? isDark
          ? "var(--color-brand-950)"
          : "var(--color-brand-50)"
        : state.isFocused
        ? isDark
          ? "#1f2937"
          : "var(--color-brand-25)"
        : isDark
        ? "#111827"
        : "white",
      color: state.isSelected
        ? isDark
          ? "var(--color-brand-300)"
          : "var(--color-brand-700)"
        : isDark
        ? "#d1d5db"
        : "#374151",
      cursor: "pointer",
      borderRadius: "6px",
      "&:active": {
        backgroundColor: isDark
          ? "var(--color-brand-900)"
          : "var(--color-brand-100)",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "10px",
      border: `1.5px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      boxShadow: isDark
        ? "0 4px 16px rgba(0,0,0,0.4)"
        : "0 4px 16px rgba(0,0,0,0.08)",
      backgroundColor: isDark ? "#111827" : "#ffffff",
    }),
    menuList: (base) => ({ ...base, padding: "4px" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "#4b5563" : "#9ca3af",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    clearIndicator: (base) => ({
      ...base,
      color: isDark ? "#4b5563" : "#9ca3af",
      "&:hover": { color: "#ef4444" },
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "#f9fafb" : "#111827",
    }),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
        {label}
      </label>
      <Select<SelectOption>
        options={options}
        value={options.find((o) => o.value === value) ?? null}
        onChange={(newValue) => {
          const opt = newValue as SingleValue<SelectOption>;
          onChange(opt?.value ?? "");
        }}
        placeholder="Semua"
        isClearable
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
        styles={{
          ...selectStyles,
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
}

// ─── FilterSearch ─────────────────────────────────────────────────────────────

function FilterSearch({
  value,
  onChange,
  placeholder = "Cari...",
}: FilterSearchProps) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full pl-9 pr-3 py-2.5 text-[13px] rounded-[10px]",
          "border border-gray-200 bg-white text-gray-900 placeholder-gray-400",
          "outline-none transition-all duration-150",
          "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
          "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600",
          "dark:focus:border-brand-500 dark:focus:ring-brand-900",
        ].join(" ")}
      />
    </div>
  );
}

// ─── ActiveFilterBadge ────────────────────────────────────────────────────────

function ActiveFilterBadge({ label, onRemove }: ActiveFilterBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        "border border-brand-200 bg-brand-50 text-brand-700 text-[12px] font-medium",
        "dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300",
      ].join(" ")}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center text-brand-400 hover:text-brand-600 dark:text-brand-500 dark:hover:text-brand-300 transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

export function FilterBar({
  tabs = [],
  selects = [],
  searchPlaceholder = "Cari...",
  onFilterChange,
}: FilterBarProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value ?? "");
  const [selectValues, setSelectValues] = useState<Record<string, string>>(
    Object.fromEntries(selects.map((s) => [s.key, ""]))
  );
  const [search, setSearch] = useState<string>("");

  const notify = (patch: Partial<FilterValues>) => {
    const next: FilterValues = {
      tab: activeTab,
      selects: selectValues,
      search,
      ...patch,
    };
    onFilterChange?.(next);
  };

  const handleTab = (val: string) => {
    setActiveTab(val);
    notify({ tab: val });
  };

  const handleSelect = (key: string, val: string) => {
    const next = { ...selectValues, [key]: val };
    setSelectValues(next);
    notify({ selects: next });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    notify({ search: val });
  };

  const resetAll = () => {
    const firstTab = tabs[0]?.value ?? "";
    const cleared = Object.fromEntries(selects.map((s) => [s.key, ""]));
    setActiveTab(firstTab);
    setSelectValues(cleared);
    setSearch("");
    onFilterChange?.({ tab: firstTab, selects: cleared, search: "" });
  };

  const activeBadges: { key: string; label: string }[] = [
    ...selects
      .filter((s) => selectValues[s.key])
      .map((s) => ({
        key: s.key,
        label: `${s.label}: ${
          s.options.find((o) => o.value === selectValues[s.key])?.label
        }`,
      })),
    ...(search ? [{ key: "__search__", label: `"${search}"` }] : []),
  ];

  const hasFilters =
    activeBadges.length > 0 || activeTab !== (tabs[0]?.value ?? "");

  return (
    <div className="font-sans">
      <div
        className={[
          "rounded-2xl overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-950",
          "divide-y divide-gray-100 dark:divide-gray-800",
        ].join(" ")}
      >
        {/* ── Tab row ── */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center px-4 py-3 bg-gray-50 dark:bg-gray-900">
            {tabs.map((t) => (
              <FilterChip
                key={t.value}
                label={t.label}
                active={activeTab === t.value}
                onClick={() => handleTab(t.value)}
              />
            ))}
          </div>
        )}

        {/* ── Controls row ── */}
        <div className="flex flex-wrap gap-3 items-end px-4 py-3.5">
          <FilterSearch
            value={search}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
          />

          {selects.map((s) => (
            <FilterSelect
              key={s.key}
              label={s.label}
              options={s.options}
              value={selectValues[s.key]}
              onChange={(val) => handleSelect(s.key, val)}
            />
          ))}

          {hasFilters && (
            <button
              type="button"
              onClick={resetAll}
              className={[
                "self-end px-3.5 py-2 text-[13px] font-medium rounded-[10px]",
                "border border-red-200 bg-red-50 text-red-500",
                "hover:bg-red-100 hover:border-red-300",
                "dark:border-red-900 dark:bg-red-950 dark:text-red-400",
                "dark:hover:bg-red-900 dark:hover:border-red-700",
                "transition-all duration-150 whitespace-nowrap cursor-pointer",
              ].join(" ")}
            >
              Reset
            </button>
          )}
        </div>

        {/* ── Active badges row ── */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-900">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-300 dark:text-gray-600 mr-1">
              Aktif
            </span>
            {activeBadges.map((b) => (
              <ActiveFilterBadge
                key={b.key}
                label={b.label}
                onRemove={() => {
                  if (b.key === "__search__") handleSearch("");
                  else handleSelect(b.key, "");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}