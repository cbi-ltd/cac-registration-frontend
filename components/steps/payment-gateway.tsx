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

  const checkPaymentStatus = React.useCallback(async () => {
    setCheckError("")
    setCheckMessage("")
    if (!store.paymentReference) {
      setCheckError("No payment reference available. Complete payment first.")
      return
    }

    setChecking(true)
    try {
      // const resp = await fetch(`${API_BASE_URL}payments/checkout/status/${store.paymentReference}`)
      const resp = await fetch(`https://cac-registration-backend.onrender.com/api/payments/checkout/status/${store.paymentReference}`)
      if (!resp.ok) throw new Error("Failed to fetch payment status")
      const json = await resp.json()
      const status = (json?.data?.data?.status || json?.data?.status || json?.status || "").toString().toLowerCase()
      if (status) {
        store.updateField("paymentStatus", status)
        setCheckMessage(`Payment status: ${status}`)
        if (status === "success") {
          // submit registration payload to backend, then mark submitted and advance
          try {
            const result = await store.submitRegistration()
            if (result?.data?.message === "application received") {
              setSubmitted(true)
              try {
                store.nextStep()
              } catch (e) {
                // ignore
              }
            } else {
              setCheckError("Submission failed: " + (result?.data?.message || "Unknown error"))
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
  }, [store.paymentReference, store.updateField, store.submitRegistration, store.nextStep])

  React.useEffect(() => {
    if (submitted || !store.paymentReference || store.paymentStatus === "success") return

    const interval = setInterval(() => {
      checkPaymentStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [submitted, store.paymentReference, store.paymentStatus, checkPaymentStatus])

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Payment Status"
        description="We are automatically checking your payment status. Once payment is confirmed, your registration will be submitted."
        icon={<CreditCard className="w-5 h-5 text-primary" />}
      >
        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
          <p className="text-xs text-muted-foreground">Payment status</p>
          <p className="text-sm font-medium text-foreground">{store.paymentStatus || "checking..."}</p>
          {/* {store.paymentReference && <p className="text-xs text-muted-foreground mt-1">Reference: {store.paymentReference}</p>} */}
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
          <p className="text-xs text-muted-foreground">Document submitted</p>
          <p className="text-sm font-medium text-foreground">{submitted ? "Yes" : "No"}</p>
        </div>

        {/* {checking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Checking payment status...
          </div>
        )} */}

        {checkError && <p className="text-sm text-destructive">{checkError}</p>}
      </FormSection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
