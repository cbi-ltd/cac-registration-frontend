"use client"

import React from "react"
import { useRegistrationStore, API_BASE_URL } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { Search, AlertCircle, CheckCircle2, Clock } from "lucide-react"

export function NameAvailabilityStep() {
  const store = useRegistrationStore()
  const [responseMessage, setResponseMessage] = React.useState("")
  const [isChecking, setIsChecking] = React.useState(false)
  const [error, setError] = React.useState("")
  const [proposedName, setProposedName] = React.useState("")
  const [lineOfBusiness, setLineOfBusiness] = React.useState("")

  const handleProposedNameChange = (value: string) => setProposedName(value)
  const handleLineOfBusinessChange = (value: string) => setLineOfBusiness(value)

  const checkAvailability = async () => {
    if (!proposedName.trim()) {
      setError("Please enter a proposed business name")
      return
    }

    setIsChecking(true)
    setError("")
    setResponseMessage("")

    try {
      const resp = await fetch(`${API_BASE_URL}check-bn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposedName: proposedName.trim(), lineOfBusiness: lineOfBusiness.trim() }),
      })

      if (!resp.ok) {
        setError("Name check failed. Please try again.")
        return
      }

      const json = await resp.json()

      const message = json?.data?.message ?? ""

      setResponseMessage(message)

      // If backend indicates the name is unique (but suggests checking similarity),
      // treat the name as available and auto-select it so the user can proceed.
      if (message === "Name is unique but check the similarity details") {
        store.updateField("selectedBusinessName", proposedName.trim())
      }
    } catch (err) {
      setError("Failed to check availability. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleSelectName = (name: string) => store.updateField("selectedBusinessName", name)
  const canProceed = store.selectedBusinessName !== ""

  return (
    <div className="space-y-6 animate-slide-up">
      <FormSection
        title="Business Name Availability Check"
        description="Enter up to 2 preferred business names in order of preference. We'll check their availability against CAC records."
        isRequired
      >
        <div className="space-y-3">
          <FormInput
            label={`Proposed Name`}
            placeholder="e.g., ABC Technology Services"
            value={proposedName}
            onChange={(e) => handleProposedNameChange(e.target.value)}
            maxLength={100}
            tooltip="Enter the exact proposed business name to check"
          />

          <FormInput
            label={`Line Of Business`}
            placeholder="e.g., Information Technology, Retail"
            value={lineOfBusiness}
            onChange={(e) => handleLineOfBusinessChange(e.target.value)}
            maxLength={100}
            tooltip="Provide the business activity or industry"
          />
        </div>

        <button
          onClick={checkAvailability}
          disabled={isChecking}
          className="w-full border border-secondary flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-destructive text-foreground font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Check Name Availability"
        >
          <Search className="w-4 h-4" />
          {isChecking ? "Checking Availability..." : "Check Availability"}
        </button>
      </FormSection>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {responseMessage && (
        <FormSection title="Availability Results" description="">
          <div className="p-4 rounded-lg bg-muted/5 border border-muted/20">
            <p className="text-sm">{responseMessage === "Name is unique but check the similarity details" ? "Name is unique" : responseMessage}</p>
          </div>
        </FormSection>
      )}

      {responseMessage === "Name is unique but check the similarity details" && canProceed && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Name Selected</p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              You've selected <strong>"{store.selectedBusinessName}"</strong>. Click Next to continue with applicant
              information.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
