import React, { useRef, useCallback } from "react";
import { Trans } from "@lingui/macro";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Formats a number into Indonesian locale string (e.g., 15.000.000).
 * Returns empty string for 0 to show placeholder instead.
 */
function formatDisplay(num: number): string {
  if (!num) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive display value directly from the prop — no useEffect needed.
  const displayValue = formatDisplay(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value.replace(/\D/g, "");
      if (rawInput === "") {
        onChange(0);
        return;
      }
      onChange(Number(rawInput));
    },
    [onChange],
  );

  return (
    <div className="relative rounded-lg shadow-theme-xs">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{/* @ts-ignore */}<Trans>Rp</Trans></span>
      </div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          disabled ? "cursor-not-allowed opacity-60 bg-gray-100 dark:bg-gray-800" : ""
        } ${className}`}
      />
    </div>
  );
};

export default CurrencyInput;
