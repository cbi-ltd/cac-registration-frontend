"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgressIndicator } from "@/components/progress-indicator"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { NameAvailabilityStep } from "@/components/steps/name-availability"
import { ApplicantInfoStep } from "@/components/steps/applicant-info"
import { BusinessDetailsStep } from "@/components/steps/business-details"
import { DocumentUploadStep } from "@/components/steps/document-upload"
import { ReviewSummaryStep } from "@/components/steps/review-summary"
import { PaymentGatewayStep } from "@/components/steps/payment-gateway"
import { ConfirmationPageStep } from "@/components/steps/confirmation-page"

const STEPS = ["Business Name", "Applicant Info", "Business Details", "Documents", "Review", "Payment", "Confirmation"]

export function RegistrationForm() {
  const { currentStep, nextStep, previousStep } = useRegistrationStore()
  const store = useRegistrationStore()
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    // If an external payment flow was in progress, centralize the resume logic here
    try {
      const pending = sessionStorage.getItem("externalPaymentPending")
      if (pending === "true") {
        sessionStorage.removeItem("externalPaymentPending")
        nextStep()
      }
    } catch (e) {
      // ignore
    }
  }, [nextStep])

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1: // Business Name
        return store.selectedBusinessName !== ""

      case 2: // Applicant Info
        if (store.applicantType === "individual") {
          return (
            store.firstName !== "" &&
            store.lastName !== "" &&
            store.dateOfBirth !== "" &&
            store.gender !== "" &&
            store.phone !== "" &&
            store.email !== "" &&
            store.residentialAddress !== ""
          )
        } else {
          return (
            store.organizationName !== "" &&
            store.rcNumber !== "" &&
            store.organizationEmail !== "" &&
            store.phone !== ""
          )
        }

      case 3: // Business Details
        return (
          store.businessActivity !== "" &&
          (!!store.sameAsResidential || store.businessAddress !== "") &&
          store.businessPhone !== "" &&
          store.businessEmail !== "" &&
          store.commencementDate !== ""
        )

      case 4: // Documents
        return (
          !!store.supportingDocBase64 &&
          !!store.signatureBase64 &&
          !!store.meansOfIdBase64 &&
          !!store.passportBase64
        )

      case 5: // Review
        // Review page validation handled internally
        return true

      case 6: // Payment
        // Allow navigation to confirmation even if paymentStatus isn't marked 'success'
        return true

      default:
        return true
    }
  }

  const handleNext = async () => {
    setIsLoading(true)
    try {
      if (isStepValid()) {
        nextStep()
        window.scrollTo(0, 0)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    previousStep()
    window.scrollTo(0, 0)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NameAvailabilityStep />
      case 2:
        return <ApplicantInfoStep />
      case 3:
        return <BusinessDetailsStep />
      case 4:
        return <DocumentUploadStep />
      case 5:
        return <ReviewSummaryStep />
      case 6:
        return <PaymentGatewayStep />
      case 7:
        return <ConfirmationPageStep />
      default:
        return null
    }
  }

  const isLastStep = currentStep === 7
  const nextButtonText =
    currentStep === 5
      ? "Proceed to Payment"
      : currentStep === 6
        ? "Complete Registration"
        : isLastStep
          ? "Back to Home"
          : "Next"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} totalSteps={7} stepNames={STEPS} />

          {/* Form Content */}
          <div className="mt-12 animate-fade-in">{renderStep()}</div>

          {/* Navigation Buttons */}
          {!isLastStep && (
            <div className="mt-12 flex justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading || !isStepValid()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : nextButtonText}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

          {isLastStep && (
            <div className="mt-12 flex justify-center">
              {/* Next button changes to Home button on confirmation page */}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
