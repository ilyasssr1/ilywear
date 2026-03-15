"use client";

import React from "react";
import clsx from "clsx";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      required,
      id,
      maxLength,
      showCharCount,
      value,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = String(value || "").length;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={clsx(
            "w-full px-4 py-3 rounded-lg border-2 text-sm transition-colors resize-vertical min-h-[120px]",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-black focus:ring-black/10",
            className,
          )}
          {...props}
        />
        <div className="flex justify-between items-start mt-1">
          <div>
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-gray-500 text-sm">{helperText}</p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p className="text-gray-500 text-xs">
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
export default TextArea;
