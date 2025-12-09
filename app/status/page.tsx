"use client"

import React from "react"
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
      // Mock API call - Replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock status data
      setStatus({
        reference,
        businessName: "ABC Technology Services",
        applicantName: "John Smith",
        status: "Approved", // pending | submitted | approved | rejected
        submittedDate: "2024-12-01",
        approvedDate: "2024-12-08",
        progress: 100,
        notes: "Your CAC business registration has been approved.",
        documents: [
          { name: "CAC Certificate", available: true },
          { name: "Registration Receipt", available: true },
          { name: "Application Form", available: true },
        ],
      })
    } catch (err) {
      setError("Failed to retrieve status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600"
      case "Pending":
        return "text-amber-600"
      case "Submitted":
        return "text-blue-600"
      case "Rejected":
        return "text-destructive"
      default:
        return "text-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case "Pending":
        return <Clock className="w-6 h-6 text-amber-600" />
      case "Rejected":
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
                    <p className={`text-2xl font-bold mt-1 ${getStatusColor(status.status)}`}>{status.status}</p>
                    <p className="text-sm text-muted-foreground mt-2">{status.notes}</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <FormSection title="Application Details">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Reference Number</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Business Name</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Applicant Name</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Submitted Date</p>
                    <p className="text-sm font-medium text-foreground mt-1">{status.submittedDate}</p>
                  </div>
                </div>
              </FormSection>

              {/* Progress */}
              <FormSection title="Processing Progress">
                <div className="space-y-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{status.progress}% Complete</p>
                </div>
              </FormSection>

              {/* Available Documents */}
              {status.documents && status.documents.some((d: any) => d.available) && (
                <FormSection title="Available Documents">
                  <div className="space-y-2">
                    {status.documents.map((doc: any) => (
                      <button
                        key={doc.name}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium text-foreground">{doc.name}</span>
                        {doc.available && <Download className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </FormSection>
              )}

              {/* Support Info */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Have questions? Contact our support team at{" "}
                  <a href="mailto:support@cbi.ng" className="font-medium underline">
                    support@cbi.ng
                  </a>{" "}
                  or call{" "}
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
