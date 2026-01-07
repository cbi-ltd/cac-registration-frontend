"use client"

import React from "react"
import { API_BASE_URL } from "@/lib/store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FormInput } from "@/components/form-input"
import { FormSection } from "@/components/form-section"
import { Search, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react"

export default function StatusPage() {
  const [reference, setReference] = React.useState("")
  const [status, setStatus] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSearch = async () => {
    if (!reference.trim()) {
      setError("Please enter an application reference")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const resp = await fetch(`${API_BASE_URL}check-status/${reference.trim()}`)

      if (!resp.ok) {
        setError("Failed to retrieve status. Please try again.")
        return
      }

      const json = await resp.json()

      // Response shape provided by backend
      // { statusCode, status, message, data: { status, transactionRef, data: { rcNumber, entityName, entityType, registrationDate, tin }, partners }, ... }
      const payload = json?.data ?? null
      if (!payload) {
        setError("No status data returned.")
        return
      }

      setStatus({
        status: payload.status,
        transactionRef: payload.transactionRef,
        entity: payload.data,
        message: json?.message ?? json?.data?.message ?? "",
      })
    } catch (err) {
      setError("Failed to retrieve status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

  const getStatusColor = (status: string) => {
    const key = (status || "").toLowerCase()
    switch (key) {
      case "approved":
        return "text-green-600"
      case "pending":
        return "text-amber-600"
      case "submitted":
        return "text-blue-600"
      case "rejected":
        return "text-destructive"
      default:
        return "text-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    const key = (status || "").toLowerCase()
    switch (key) {
      case "approved":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case "pending":
        return <Clock className="w-6 h-6 text-amber-600" />
      case "rejected":
        return <AlertCircle className="w-6 h-6 text-destructive" />
      default:
        return <Clock className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Check Application Status</h1>
            <p className="text-lg text-muted-foreground">
              Enter your application reference number to view the status of your CAC registration
            </p>
          </div>

          <FormSection title="Application Reference">
            <div className="flex gap-2 flex-col sm:flex-row">
              <FormInput
                label=""
                placeholder="E.g., CBI-REG-2024-001234"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </FormSection>

          {error && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {status && (
            <div className="mt-12 space-y-6 animate-slide-up">
              {/* Status Header */}
              <div className="p-6 rounded-lg bg-secondary border border-border">
                <div className="flex items-start gap-4">
                  {getStatusIcon(status.status)}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Application Status</p>
                    <p className={`text-2xl font-bold mt-1 ${getStatusColor(status.status)}`}>{capitalize(status.status)}</p>
                    {status.message && <p className="text-sm text-muted-foreground mt-2">{status.message}</p>}
                  </div>
                </div>
              </div>

              {/* Application Details - display backend data */}
              <FormSection title="Application Details">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Reference / Transaction</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.transactionRef}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Entity Name</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.entity?.entityName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Entity Type</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.entity?.entityType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">RC Number</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.entity?.rcNumber ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Registration Date</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {status.entity?.registrationDate ? new Date(status.entity.registrationDate).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">TIN</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.entity?.tin ?? "-"}</p>
                  </div>
                </div>
              </FormSection>

              {/* Support Info */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Have questions? Contact our support team at{' '}
                  <a href="mailto:support@cbi.ng" className="font-medium underline">
                    support@cbi.ng
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+234800000000" className="font-medium underline">
                    +234 800 000 0000
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
