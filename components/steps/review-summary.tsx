"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function ReviewSummaryStep() {
  const store = useRegistrationStore()
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

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
    if (!store.passportPhoto || !store.idDocument) newErrors.push("Required documents not uploaded")
    if (!store.proofOfAddress || !store.consentLetter) newErrors.push("Address proof or consent letter missing")
    if (!termsAccepted) newErrors.push("Terms and conditions must be accepted")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const summaryData = [
    {
      section: "Business Information",
      items: [
        { label: "Business Name", value: store.selectedBusinessName },
        { label: "Business Activity", value: store.businessActivity },
        { label: "Nature of Business", value: store.natureOfBusiness },
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
              { label: "ID Type", value: store.idType },
            ]
          : [
              { label: "Organization Name", value: store.organizationName },
              { label: "RC Number", value: store.rcNumber },
              { label: "Email", value: store.organizationEmail },
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
                { name: "ID Document", uploaded: !!store.idDocument },
                { name: "Passport Photo", uploaded: !!store.passportPhoto },
                { name: "Proof of Address", uploaded: !!store.proofOfAddress },
                { name: "Consent Letter", uploaded: !!store.consentLetter },
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
      <FormSection title="Fee Summary">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CAC Registration Fee</span>
            <span className="font-medium text-foreground">₦10,000.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Charge</span>
            <span className="font-medium text-foreground">₦2,000.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (7.5%)</span>
            <span className="font-medium text-foreground">₦900.00</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total Amount Due</span>
            <span className="font-bold text-lg text-primary">₦12,900.00</span>
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
          After clicking Next, you'll be redirected to secure payment. Your application will be submitted to CAC after
          successful payment.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
