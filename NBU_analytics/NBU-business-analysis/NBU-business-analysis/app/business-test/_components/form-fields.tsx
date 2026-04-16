"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-[14px] font-semibold text-carbon mb-[6px]">
      {children}
    </label>
  );
}

export function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[12px] font-normal italic text-steel-500 mt-1">
      {children}
    </p>
  );
}

export const INPUT_CLASSES =
  "w-full h-12 px-4 bg-white border-[1.5px] border-border rounded-[10px] font-sans text-[14px] font-medium text-carbon placeholder:text-gray-600 placeholder:font-normal outline-none transition-[border-color,box-shadow] duration-150 focus:border-gold-500 focus:shadow-[0_0_0_3px_rgba(215,181,109,0.15)]";

export function TextField({
  label,
  placeholder,
  helper,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  helper?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASSES}
      />
      {helper && <FieldHelper>{helper}</FieldHelper>}
    </div>
  );
}

export function SelectField({
  label,
  options,
  helper,
  value,
  onChange,
  placeholder: placeholderProp,
  disabled = false,
}: {
  label: string;
  options: readonly string[];
  helper?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { lang } = useLang();
  const placeholder = placeholderProp ?? (lang === "uz" ? "Танланг" : "Выберите");

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            INPUT_CLASSES,
            "appearance-none pr-10 cursor-pointer",
            disabled && "bg-gray-100 cursor-not-allowed text-gray-600",
            !value && "text-gray-600 font-normal",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-carbon font-medium">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 pointer-events-none"
        />
      </div>
      {helper && <FieldHelper>{helper}</FieldHelper>}
    </div>
  );
}

export function SectionLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "gold" | "navy";
}) {
  const borderColor = color === "gold" ? "#D7B56D" : "#193F72";
  const textClass = color === "gold" ? "text-gold-500" : "text-navy-900";
  return (
    <div
      className={cn(
        "pl-3 font-sans text-[12px] font-bold uppercase tracking-[1px]",
        textClass,
      )}
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {children}
    </div>
  );
}
