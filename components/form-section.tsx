"use client"

import React from "react"
import { AlertCircle, ChevronDown } from "lucide-react"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  error?: string
  isRequired?: boolean
  icon?: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

export function FormSection({
  title,
  description,
  children,
  error,
  isRequired,
  icon,
  collapsible,
  defaultOpen = true,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  if (collapsible) {
    return (
      <div className="space-y-4 border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <div className="text-left">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {title}
                {isRequired && <span className="text-destructive">*</span>}
              </h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && <div className="px-4 pb-4 space-y-4 border-t border-border">{children}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border border-border">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1">{icon}</div>}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {title}
            {isRequired && <span className="text-destructive">*</span>}
          </h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>

      <div className="space-y-4">{children}</div>

      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
