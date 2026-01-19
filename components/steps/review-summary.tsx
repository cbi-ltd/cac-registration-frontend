"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function ReviewSummaryStep() {
  const store = useRegistrationStore()
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])
  const amount: number = 500
  // const amount: number = 29000
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false)
  const [checking, setChecking] = React.useState(false)
  const [checkMessage, setCheckMessage] = React.useState("")
  const [checkError, setCheckError] = React.useState("")
  const [submitted, setSubmitted] = React.useState<boolean>(() => !!store.applicationId)

  const validateSubmission = (): boolean => {
    const newErrors: string[] = []

    if (!store.selectedBusinessName) newErrors.push("Business name not selected")

    if (store.applicantType === "individual") {
      if (!store.firstName || !store.lastName) newErrors.push("Applicant name incomplete")
    } else {
      if (!store.organizationName) newErrors.push("Organization name not provided")
      if (!store.rcNumber) newErrors.push("RC number not provided")
    }

    if (!store.email || !store.phone) newErrors.push("Contact information incomplete")
    if (!store.businessActivity) newErrors.push("Business activity not selected")
    if (!store.commencementDate) newErrors.push("Business commencement date not set")
    if (!store.supportingDocBase64 || !store.signatureBase64) newErrors.push("Supporting documents not uploaded")
    if (!store.meansOfIdBase64 || !store.passportBase64) newErrors.push("ID or passport missing")
    if (!termsAccepted) newErrors.push("Terms and conditions must be accepted")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const checkPaymentStatus = React.useCallback(async () => {
    setCheckError("")
    setCheckMessage("")
    if (!store.paymentReference) {
      setCheckError("No payment reference available. Complete payment first.")
      return
    }

    setChecking(true)
    try {
      const resp = await fetch(`https://cac-registration-backend.onrender.com/api/payments/checkout/status/${store.paymentReference}`)
      if (!resp.ok) throw new Error("Failed to fetch payment status")
      const json = await resp.json()
      // const status = (json?.data?.data?.status || json?.data?.status || json?.status || "").toString().toLowerCase()
      const status = "success" // For testing purposes
      if (status) {
        store.updateField("paymentStatus", status)
        setCheckMessage(`Payment status: ${status}`)
        if (status === "success") {
          // submit registration payload to backend, then mark submitted and advance
          try {
            const result = await store.submitRegistration()
            if (result?.data?.message === "application received") {
              setSubmitted(true)
              store.updateField("submitted", true)
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

  // React.useEffect(() => {
  //   if (submitted || !store.paymentReference || store.paymentStatus === "success") return

  //   const interval = setInterval(() => {
  //     checkPaymentStatus()
  //   }, 9000)

  //   return () => clearInterval(interval)
  // }, [submitted, store.paymentReference, store.paymentStatus, checkPaymentStatus])
  

  const initiatePayment = async () => {
    setErrors([])

    if (!validateSubmission()) return

    setIsProcessingPayment(true)
    try {
      const payload = {
        amount: amount,
        walletId: "master",
        currency: "NGN",
        metdata: {},
      }

      const resp = await fetch("https://cac-registration-backend.onrender.com/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!resp.ok ) {
        // const text = await resp.text()
        setErrors([`Payment initialization failed: ${resp.status}`])
        // setErrors([`Payment initialization failed: ${resp.status} ${text}`])
        return
      }

      const json = await resp.json()
      const authUrl = json?.checkout?.data?.authorization_url
      store.paymentReference = json?.checkout?.data?.reference

      if (!authUrl) {
        setErrors(["Payment initialization failed: missing authorization URL"]) 
        return
      }

      // Mark that an external payment flow is in progress so we can resume after redirect
      try {
        localStorage.setItem("externalPaymentPending", "true")
      } catch (e) {
        // ignore
      }

      // Redirect user to the payment provider
      // window.location.href = authUrl
      window.open(authUrl, "_blank")
      setIsProcessingPayment(false)
      checkPaymentStatus()
      // Note: Page will unload, so finally block won't execute as expected
    } catch (err: any) {
      setErrors(["Unable to initialize payment. Please try again."])
      setIsProcessingPayment(false)
    }
  }

  const summaryData = [
    {
      section: "Business Information",
      items: [
        { label: "Business Name", value: store.selectedBusinessName },
        { label: "Line of Business", value: store.businessActivity },
        { label: "Business Email", value: store.businessEmail },
        { label: "Business Phone", value: store.businessPhone },
        { label: "Commencement Date", value: store.commencementDate },
      ],
    },
    {
      section: "Applicant Information",
      items:
        store.applicantType === "individual"
          ? [
              { label: "Full Name", value: `${store.firstName} ${store.middleName} ${store.lastName}`.trim() },
              { label: "Date of Birth", value: store.dateOfBirth },
              { label: "Email", value: store.email },
              { label: "Phone", value: store.phone },
              { label: "Nationality", value: store.nationality },
              { label: "Gender", value: store.gender },
              { label: "Residential Address", value: store.residentialAddress },
            ]
          : [
              { label: "Organization Name", value: store.organizationName },
              { label: "RC Number", value: store.rcNumber },
              { label: "Organization Email", value: store.organizationEmail },
              { label: "Phone", value: store.phone },
            ],
    },
    {
      section: "Address Information",
      items: [
        { label: "Residential Address", value: store.residentialAddress },
        {
          label: "Business Address",
          value: store.sameAsResidential ? "Same as residential" : store.businessAddress,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Review Your Application"
        description="Please review all information before proceeding to payment. Click Previous to make changes."
        icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
      >
        <div className="space-y-6">
          {summaryData.map((section) => (
            <div key={section.section} className="space-y-3">
              <h3 className="font-semibold text-foreground text-lg">{section.section}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{item.label}</p>
                    <p className="text-sm text-foreground font-medium mt-1">{item.value || "Not provided"}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase">Documents Uploaded</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { name: "Supporting Document", uploaded: !!store.supportingDocBase64 },
                { name: "Signature (scanned)", uploaded: !!store.signatureBase64 },
                { name: "Means of ID", uploaded: !!store.meansOfIdBase64 },
                { name: "Passport Photo", uploaded: !!store.passportBase64 },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${doc.uploaded ? "bg-green-600" : "bg-destructive"}`} />
                  <span className="text-sm text-foreground">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Fee Summary */}
      <FormSection title="Total Amount Due" description="Make use of bank transfer where possible and not card payment.">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            {/* <span className="text-muted-foreground">CAC Registration Fee</span> */}
            {/* <span className="font-medium text-foreground">₦28,000.00</span> */}
          </div>
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Charge</span>
            <span className="font-medium text-foreground">₦2,000.00</span>
          </div> */}
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (7.5%)</span>
            <span className="font-medium text-foreground">₦900.00</span>
          </div> */}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">CAC Registration Fee</span>
            <span className="font-bold text-lg text-primary">₦{amount}</span>
          </div>
        </div>
      </FormSection>

      {/* Terms & Conditions */}
      <FormSection title="Terms & Conditions" isRequired>
        <div className="space-y-3">
          {[
            "I confirm that all information provided is accurate and truthful",
            "I understand this registration is with the Corporate Affairs Commission (CAC)",
            "I understand that registration fees are non-refundable",
            "I consent to the processing of my personal data in accordance with privacy laws",
            "I authorize CBI Technologies to submit this application on my behalf",
          ].map((term, index) => (
            <label key={index} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm text-muted-foreground">{term}</span>
            </label>
          ))}
        </div>
      </FormSection>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="font-medium text-destructive">Please fix the following before submitting:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          You'll be redirected to secure payment. Your application will be submitted to CAC after
          successful payment.
        </p>
      </div>

      {store.paymentReference && (
        <>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <p className="text-xs text-muted-foreground">Payment status</p>
            <p className="text-sm font-medium text-foreground">{store.paymentStatus || "checking..."}</p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <p className="text-xs text-muted-foreground">Document submitted</p>
            <p className="text-sm font-medium text-foreground">{submitted ? "Yes" : "No"}</p>
          </div>

          {checkError && <p className="text-sm text-destructive">{checkError}</p>}
        </>
      )}

      <div className="flex gap-3">
        {/* <button
          type="button"
          onClick={() => store.previousStep()}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-transparent text-foreground"
        >
          Previous
        </button> */}

        <button
          type="button"
          onClick={initiatePayment}
          disabled={isProcessingPayment}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
        >
          {isProcessingPayment ? "Redirecting to payment..." : `Pay ₦${amount}`}
        </button>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
