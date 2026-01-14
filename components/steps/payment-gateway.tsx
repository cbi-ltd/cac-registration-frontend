"use client"

import React from "react"
import { useRegistrationStore, API_BASE_URL } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { CreditCard  } from "lucide-react"

interface PaymentError {
  type: "network" | "server" | "validation" | "declined" | "timeout"
  message: string
}

export function PaymentGatewayStep() {
  const store = useRegistrationStore()
  const [checking, setChecking] = React.useState(false)
  const [checkMessage, setCheckMessage] = React.useState("")
  const [checkError, setCheckError] = React.useState("")
  const [submitted, setSubmitted] = React.useState<boolean>(() => !!store.applicationId)

  const checkPaymentStatus = async () => {
    setCheckError("")
    setCheckMessage("")
    if (!store.paymentReference) {
      setCheckError("No payment reference available. Complete payment first.")
      return
    }

    setChecking(true)
    try {
      const resp = await fetch(`${API_BASE_URL}payments/checkout/status/${store.paymentReference}`)
      if (!resp.ok) throw new Error("Failed to fetch payment status")
      const json = await resp.json()
      const status = (json?.data?.data?.status || json?.data?.status || json?.status || "").toString().toLowerCase()
      if (status) {
        store.updateField("paymentStatus", status)
        setCheckMessage(`Payment status: ${status}`)
        if (status === "success") {
          // submit registration payload to backend, then mark submitted and advance
          try {
            const payload = JSON.parse(JSON.stringify(store))
            await store.submitRegistration(payload)
            setSubmitted(true)
            try {
              store.nextStep()
            } catch (e) {
              // ignore
            }
          } catch (err: any) {
            setCheckError(err?.message || "Submission after payment failed")
            store.updateField("paymentStatus", "failed")
          }
        }
      } else {
        setCheckError("Payment status not available")
      }
    } catch (err: any) {
      setCheckError(err?.message || "Unable to check payment status")
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Payment Status"
        description="Check your payment and submission status."
        icon={<CreditCard className="w-5 h-5 text-primary" />}
      >
        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
          <p className="text-xs text-muted-foreground">Payment status</p>
          <p className="text-sm font-medium text-foreground">{store.paymentStatus || "not started"}</p>
          {store.paymentReference && <p className="text-xs text-muted-foreground mt-1">Reference: {store.paymentReference}</p>}
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
          <p className="text-xs text-muted-foreground">Document submitted</p>
          <p className="text-sm font-medium text-foreground">{submitted ? "Yes" : "No"}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkPaymentStatus}
            disabled={checking}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check Payment Status"}
          </button>
          {checkMessage && <p className="text-sm text-foreground">{checkMessage}</p>}
          {checkError && <p className="text-sm text-destructive">{checkError}</p>}
        </div>
      </FormSection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
