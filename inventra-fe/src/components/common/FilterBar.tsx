import { useState } from "react";

const brandVars: React.CSSProperties = {
  "--color-brand-25": "#f2f7ff",
  "--color-brand-50": "#ecf3ff",
  "--color-brand-100": "#dde9ff",
  "--color-brand-200": "#c2d6ff",
  "--color-brand-300": "#9cb9ff",
  "--color-brand-400": "#7592ff",
  "--color-brand-500": "#465fff",
  "--color-brand-600": "#3641f5",
  "--color-brand-700": "#2a31d8",
  "--color-brand-800": "#252dae",
  "--color-brand-900": "#262e89",
  "--color-brand-950": "#161950",
} as React.CSSProperties;


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


function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        padding: "6px 14px",
        borderRadius: "999px",
        border: active
          ? "1.5px solid var(--color-brand-500)"
          : "1.5px solid #e5e7eb",
        background: active ? "var(--color-brand-50)" : "#ffffff",
        color: active ? "var(--color-brand-600)" : "#6b7280",
        cursor: "pointer",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        outline: "none",
        boxShadow: active
          ? "0 0 0 3px var(--color-brand-100)"
          : "0 1px 2px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.target as HTMLButtonElement).style.borderColor = "var(--color-brand-300)";
          (e.target as HTMLButtonElement).style.color = "var(--color-brand-500)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.target as HTMLButtonElement).style.borderColor = "#e5e7eb";
          (e.target as HTMLButtonElement).style.color = "#6b7280";
        }
      }}
    >
      {label}
    </button>
  );
}


import Select, { SingleValue, StylesConfig } from "react-select";

const selectStyles: StylesConfig<SelectOption> = {
  container: (base) => ({ ...base, minWidth: 140 }),
  control: (base, state) => ({
    ...base,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "var(--color-brand-400)" : "#e5e7eb",
    borderWidth: "1.5px",
    boxShadow: state.isFocused ? "0 0 0 3px var(--color-brand-100)" : "none",
    minHeight: "38px",
    cursor: "pointer",
    "&:hover": { borderColor: "var(--color-brand-300)" },
  }),
  placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "var(--color-brand-700)", fontWeight: 500, fontSize: "13px" }),
  option: (base, state) => ({
    ...base,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    backgroundColor: state.isSelected ? "var(--color-brand-50)" : state.isFocused ? "var(--color-brand-25)" : "white",
    color: state.isSelected ? "var(--color-brand-700)" : "#374151",
    cursor: "pointer",
    "&:active": { backgroundColor: "var(--color-brand-100)" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  }),
  menuList: (base) => ({ ...base, padding: "4px" }),
  dropdownIndicator: (base) => ({ ...base, color: "#9ca3af" }),
  indicatorSeparator: () => ({ display: "none" }),
  clearIndicator: (base) => ({ ...base, color: "#9ca3af", "&:hover": { color: "#ef4444" } }),
};

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#9ca3af",
      }}>
        {label}
      </label>
      <Select<SelectOption>
        options={options}
        value={options.find((o) => o.value === value) ?? null}
        onChange={(newValue, _actionMeta) => {
          const opt = newValue as SingleValue<SelectOption>;
          onChange(opt?.value ?? "");
        }}
        placeholder="Semua"
        isClearable
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          ...selectStyles,
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>


  );
}

function FilterSearch({ value, onChange, placeholder = "Cari..." }: FilterSearchProps) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
      <svg
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
        }}
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
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          padding: "9px 12px 9px 36px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          background: "#ffffff",
          color: "#111827",
          width: "100%",
          outline: "none",
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-brand-400)";
          e.target.style.boxShadow = "0 0 0 3px var(--color-brand-100)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}


function ActiveFilterBadge({ label, onRemove }: ActiveFilterBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "999px",
        background: "var(--color-brand-50)",
        border: "1px solid var(--color-brand-200)",
        color: "var(--color-brand-700)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          color: "var(--color-brand-400)",
          display: "flex",
          alignItems: "center",
          lineHeight: 1,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

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
        label: `${s.label}: ${s.options.find((o) => o.value === selectValues[s.key])?.label}`,
      })),
    ...(search ? [{ key: "__search__", label: `"${search}"` }] : []),
  ];

  const hasFilters =
    activeBadges.length > 0 || activeTab !== (tabs[0]?.value ?? "");

  return (
    <div style={{ ...brandVars, fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #f3f4f6",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
          overflow: "hidden",
        }}
      >
        {/* Tab row */}
        {tabs.length > 0 && (
          <div
            style={{
              borderBottom: "1px solid #f3f4f6",
              padding: "12px 16px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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


        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
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
              onClick={resetAll}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1.5px solid #fee2e2",
                background: "#fff5f5",
                color: "#ef4444",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                alignSelf: "flex-end",
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Active badges */}
        {activeBadges.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #f9fafb",
              padding: "10px 16px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#d1d5db",
                marginRight: "4px",
              }}
            >
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


