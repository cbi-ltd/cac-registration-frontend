"use client"

import React from "react"
import { AlertCircle, Info } from "lucide-react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  tooltip?: string
  required?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, tooltip, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {tooltip && (
            <span className="ml-2 inline-flex items-center group cursor-help">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="hidden group-hover:block absolute mt-2 p-2 bg-foreground text-background text-xs rounded whitespace-nowrap z-10">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
            error ? "border-destructive" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"
