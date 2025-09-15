"use client";
import { useId } from "react";

export default function Switch({ label, checked, onChange, disabled = false, helpText }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <label htmlFor={id} className="flex-1 cursor-pointer select-none">
        <div className="text-sm font-medium">{label}</div>
        {helpText ? <div className="text-xs section-title mt-0.5">{helpText}</div> : null}
      </label>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        data-checked={checked ? "true" : "false"}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2",
          "switch-track",                 // themed background
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full transition-transform duration-200",
            "switch-knob",                 // themed knob
            checked ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
