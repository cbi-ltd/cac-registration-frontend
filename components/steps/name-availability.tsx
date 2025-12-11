"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { Search, AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface NameCheckResult {
  name: string
  available: boolean
  status: "pending" | "available" | "reserved" | "checking"
}

export function NameAvailabilityStep() {
  const store = useRegistrationStore()
  const [results, setResults] = React.useState<NameCheckResult[]>([])
  const [isChecking, setIsChecking] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...store.preferredNames]
    newNames[index] = value
    store.updateField("preferredNames", newNames)
  }

  const checkAvailability = async () => {
    const names = store.preferredNames.filter((n) => n.trim() !== "")

    if (names.length === 0) {
      setError("Please enter at least one business name")
      return
    }

    setIsChecking(true)
    setError("")
    setResults(
      names.map((name) => ({
        name,
        available: false,
        status: "checking",
      })),
    )

    try {
      // Mock API call - Replace with real Oasis VAS endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockResults: NameCheckResult[] = names.map((name) => ({
        name,
        available: Math.random() > 0.3, // 70% chance available for demo
        status: Math.random() > 0.3 ? "available" : "reserved",
      }))

      setResults(mockResults)

      // Auto-select first available name if user hasn't selected one
      const firstAvailable = mockResults.find((r) => r.available)
      if (firstAvailable && !store.selectedBusinessName) {
        store.updateField("selectedBusinessName", firstAvailable.name)
      }
    } catch (err) {
      setError("Failed to check availability. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleSelectName = (name: string) => {
    store.updateField("selectedBusinessName", name)
  }

  const hasAvailableName = results.some((r) => r.available)
  const canProceed = store.selectedBusinessName !== ""

  return (
    <div className="space-y-6 animate-slide-up">
      <FormSection
        title="Business Name Availability Check"
        description="Enter up to 2 preferred business names in order of preference. We'll check their availability against CAC records."
        isRequired
      >
        <div className="space-y-3">
          {[0, 1].map((index) => (
            <FormInput
              key={index}
              label={`Business Name ${index + 1} ${index === 0 ? "(Primary)" : ""}`}
              placeholder="e.g., ABC Technology Services"
              value={store.preferredNames[index] || ""}
              onChange={(e) => handleNameChange(index, e.target.value)}
              maxLength={50}
              tooltip="Business name must be 2-50 characters and relevant to your business activity"
              helperText={`${store.preferredNames[index]?.length || 0}/50 characters`}
            />
          ))}
        </div>

        <button
          onClick={checkAvailability}
          disabled={isChecking}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {results.length > 0 && (
        <FormSection
          title="Availability Results"
          description="Select an available business name to proceed. You can only select names marked as available."
        >
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.name}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  store.selectedBusinessName === result.name
                    ? "border-primary bg-primary/5"
                    : result.available
                      ? "border-border hover:border-primary/50 hover:bg-secondary/50"
                      : "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                }`}
                onClick={() => result.available && handleSelectName(result.name)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{result.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {result.status === "checking" && (
                        <>
                          <Clock className="w-4 h-4 text-muted-foreground animate-spin" />
                          <span className="text-sm text-muted-foreground">Checking...</span>
                        </>
                      )}
                      {result.status === "available" && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Available</span>
                        </>
                      )}
                      {result.status === "reserved" && (
                        <>
                          <AlertCircle className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-destructive font-medium">Reserved/Not Available</span>
                        </>
                      )}
                    </div>
                  </div>

                  {result.available && (
                    <input
                      type="radio"
                      name="business-name"
                      checked={store.selectedBusinessName === result.name}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {!hasAvailableName && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                None of the names you entered are available. Please try different names.
              </p>
            </div>
          )}
        </FormSection>
      )}

      {canProceed && (
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
