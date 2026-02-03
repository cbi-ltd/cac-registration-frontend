"use client"

import React from "react"
import { useRegistrationStore, RegistrationData } from "@/lib/store"
import Link from "next/link"
import { CheckCircle2, Copy, Download, ArrowRight } from "lucide-react"

export function ConfirmationPageStep() {
  const store = useRegistrationStore()
  const [copied, setCopied] = React.useState(false)

  const handleCopyReference = () => {
    // Do not expose transactionRef/applicationReference directly per privacy requirement
    // Provide a generic acknowledgement copy instead
    navigator.clipboard.writeText("Your application reference is available in your email.")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // const downloadReceipt = () => {
  //   const receipt = `CAC BUSINESS REGISTRATION - RECEIPT

  //   Date: ${new Date().toLocaleDateString()}
  //   Time: ${new Date().toLocaleTimeString()}

  //   REGISTERED DETAILS
  //   ==================
  //   Business Name: ${store.selectedBusinessName}
  //   Applicant Type: ${store.applicantType.toUpperCase()}
  //   ${
  //     store.applicantType === "individual"
  //       ? `Applicant Name: ${store.firstName} ${store.lastName}`
  //       : `Organization: ${store.organizationName}`
  //   }
  //   Business Activity: ${store.businessActivity}

  //   PAYMENT INFORMATION
  //   ===================
  //   Total Paid: ₦29,000.00
  //   Payment Status: SUCCESS

  //   NEXT STEPS
  //   ==========
  //   1. Your application has been successfully submitted to CAC
  //   2. Check your application status via the support channels provided
  //   3. Expected processing time: 2-5 working days

  //   IMPORTANT NOTES
  //   ===============
  //   - Keep this receipt for your records
  //   - Do not share sensitive transaction information
  //   - For inquiries, contact support@cbitechnologiesltd.ng or call +234 (0) 800 000 0000

  //   ---
  //   This is an automated receipt. For questions, please contact CBI Technologies support.`

  //   const blob = new Blob([receipt], { type: "text/plain" })
  //   const url = window.URL.createObjectURL(blob)
  //   const a = document.createElement("a")
  //   a.href = url
  //   a.download = `CAC_Registration_Receipt_${Date.now()}.txt`
  //   document.body.appendChild(a)
  //   a.click()
  //   window.URL.revokeObjectURL(url)
  //   document.body.removeChild(a)
  // }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">Registration Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your business registration application has been submitted to CAC successfully. copy and keep your reference
        </p>

        {/* Reference Notice (hidden transactionRef) */}
        {/* <div className="bg-secondary rounded-lg p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-2 uppercase font-semibold">Application Reference</p>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-sm text-muted-foreground">A unique reference has been recorded and ${store.transactionRef}.</span>
            <button
              onClick={handleCopyReference}
              className="p-2 hover:bg-secondary-dark rounded-lg transition-colors"
              title="Copy info"
            >
              <Copy className="w-5 h-5 text-primary" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{copied ? "✓ Copied to clipboard!" : "Check your email for the reference number"}</p>
        </div> */}

        {/* Confirmation Details */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Business Name</p>
            <p className="font-semibold text-foreground">{store.selectedBusinessName}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Total Amount Paid</p>
            <p className="font-semibold text-foreground">₦29,000.00</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Applicant</p>
            <p className="font-semibold text-foreground">
              {store.applicantType === "individual" ? `${store.firstName} ${store.lastName}` : store.organizationName}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Submission Date</p>
            <p className="font-semibold text-foreground">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Reference</p>
            <p className="font-semibold text-foreground">{store.paymentReference}</p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto text-left">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">What Happens Next?</h3>
          <div className="space-y-3">
            {/* <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold text-sm flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Confirmation Email</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Check your email for a detailed confirmation and receipt
                </p>
              </div>
            </div> */}
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold text-sm flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">CAC Processing</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  CAC will process your application (typically 2-5 working days)
                </p>
              </div>
            </div>
            {/* <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold text-sm flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Status Updates</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You'll receive status updates via email. You can also check status using the reference above
                </p>
              </div>
            </div> */}
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold text-sm flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Certificate Download</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Once approved, download your CAC certificate and proceed with PoS setup
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          {/* <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button> */}
          {/* <button
          type="button"
          onClick={() => store.previousStep()}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-transparent text-foreground"
        >
          Previous
        </button> */}
          <Link
            href="/"
            onClick={() => {
              try {
                localStorage.clear()
                sessionStorage.clear()
              } catch (e) {
                // ignore storage clearing errors
              }
              store.reset()
            }}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Support Section */}
        {/* <div className="mt-12 pt-8 border-t border-border text-center max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4">Need help? Contact our support team</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <a
              href="/support"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              Support Center
            </a>
            <a
              href="mailto:support@cbi.ng"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              Email Support
            </a>
            <a
              href="tel:+234800000000"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              Call Support
            </a>
          </div>
        </div> */}
      </div>
    </div>
  )
}
