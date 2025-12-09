"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { CreditCard, AlertCircle, CheckCircle2, Loader2, AlertTriangle } from "lucide-react"

interface PaymentError {
  type: "network" | "server" | "validation" | "declined" | "timeout"
  message: string
}

export function PaymentGatewayStep() {
  const store = useRegistrationStore()
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvv, setCvv] = React.useState("")
  const [cardholderName, setCardholderName] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<PaymentError | null>(null)
  const [paymentSuccess, setPaymentSuccess] = React.useState(false)

  const processPayment = async () => {
    setIsProcessing(true)
    setPaymentError(null)

    try {
      // Validate inputs
      if (!cardNumber || !expiry || !cvv || !cardholderName) {
        setPaymentError({
          type: "validation",
          message: "Please fill in all payment details",
        })
        setIsProcessing(false)
        return
      }

      if (cardNumber.length !== 16) {
        setPaymentError({
          type: "validation",
          message: "Card number must be 16 digits",
        })
        setIsProcessing(false)
        return
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setPaymentError({
          type: "validation",
          message: "Expiry date must be MM/YY",
        })
        setIsProcessing(false)
        return
      }

      if (cvv.length !== 3 && cvv.length !== 4) {
        setPaymentError({
          type: "validation",
          message: "CVV must be 3 or 4 digits",
        })
        setIsProcessing(false)
        return
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random payment scenarios (80% success rate for demo)
      const randomFail = Math.random()

      if (randomFail < 0.05) {
        // Network error (5%)
        throw new Error("Network timeout. Please check your connection and try again.")
      } else if (randomFail < 0.08) {
        // Server error (3%)
        throw new Error("Payment server temporarily unavailable. Please try again later.")
      } else if (randomFail < 0.12) {
        // Declined card (4%)
        setPaymentError({
          type: "declined",
          message: "Your card was declined. Please check your card details and try again.",
        })
        setIsProcessing(false)
        return
      } else if (randomFail < 0.15) {
        // Timeout (3%)
        throw new Error("Payment processing timeout. Please try again.")
      }

      // Success (75%)
      const reference = `CBI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      store.updateField("paymentStatus", "success")
      store.updateField("paymentReference", reference)
      store.updateField("applicationReference", reference)
      setPaymentSuccess(true)

      // Auto move to next step after success
      setTimeout(() => {
        store.nextStep()
      }, 2000)
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred"

      // Determine error type
      let errorType: PaymentError["type"] = "server"
      if (errorMessage.includes("Network") || errorMessage.includes("connection")) {
        errorType = "network"
      } else if (errorMessage.includes("timeout")) {
        errorType = "timeout"
      }

      setPaymentError({
        type: errorType,
        message: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    // Add spaces every 4 digits for readability
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardNumber(formatted)
  }

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 2) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2, 4)}`)
    } else {
      setExpiry(digits)
    }
  }

  const handleCvvChange = (value: string) => {
    setCvv(value.replace(/\D/g, "").slice(0, 4))
  }

  if (paymentSuccess) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Payment Successful!</h2>
          <p className="text-muted-foreground mb-2">Your registration payment has been processed successfully.</p>
          <p className="text-sm text-muted-foreground mb-6">
            Reference: <span className="font-mono font-semibold text-foreground">{store.paymentReference}</span>
          </p>

          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">1.</span>
                <span>Your application will be submitted to the CAC</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">2.</span>
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">3.</span>
                <span>Your application status will be updated regularly</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground mt-8">Redirecting to confirmation page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Payment - CBI Monie"
        description="Secure payment processing powered by CBI Monie"
        icon={<CreditCard className="w-5 h-5 text-primary" />}
        isRequired
      >
        {/* Amount Summary */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground">Amount to Pay:</span>
            <span className="text-3xl font-bold text-primary">₦12,900</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Includes CAC Registration (₦10,000) + Service Charge (₦2,000) + VAT (₦900)
          </p>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name *</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Enter name as shown on card"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Card Number *</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-1">Demo: Use any 16 digits (e.g., 4532015112830366)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expiry Date *</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Error Messages */}
      {paymentError && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            paymentError.type === "declined"
              ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
              : "bg-destructive/10 border-destructive/20"
          }`}
        >
          {paymentError.type === "declined" ? (
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={`font-medium ${
                paymentError.type === "declined" ? "text-yellow-900 dark:text-yellow-100" : "text-destructive"
              }`}
            >
              {paymentError.type === "network"
                ? "Network Error"
                : paymentError.type === "server"
                  ? "Server Error"
                  : paymentError.type === "timeout"
                    ? "Request Timeout"
                    : "Payment Declined"}
            </p>
            <p
              className={`text-sm mt-1 ${
                paymentError.type === "declined" ? "text-yellow-800 dark:text-yellow-200" : "text-destructive/80"
              }`}
            >
              {paymentError.message}
            </p>
            <p className="text-xs mt-2 opacity-75">
              {paymentError.type === "network"
                ? "Please check your internet connection and try again."
                : paymentError.type === "server"
                  ? "The payment server is experiencing issues. Please try again in a few moments."
                  : paymentError.type === "timeout"
                    ? "The request took too long. Please try again."
                    : "Verify your card details and try a different card."}
            </p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          🔒 Your payment information is encrypted and secure. This is a demo gateway - no actual charges will be made.
        </p>
      </div>

      {/* Process Button */}
      <button
        onClick={processPayment}
        disabled={isProcessing || !cardNumber || !expiry || !cvv || !cardholderName}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ₦12,900
          </>
        )}
      </button>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
