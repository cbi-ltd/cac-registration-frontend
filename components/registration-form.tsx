"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgressIndicator } from "@/components/progress-indicator";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { NameAvailabilityStep } from "@/components/steps/name-availability";
import { ApplicantInfoStep } from "@/components/steps/applicant-info";
import { BusinessDetailsStep } from "@/components/steps/business-details";
import { DocumentUploadStep } from "@/components/steps/document-upload";
import { ReviewSummaryStep } from "@/components/steps/review-summary";
import { ConfirmationPageStep } from "@/components/steps/confirmation-page";
import { validateDateOfBirth, validateEmail } from "@/lib/validation";

const STEPS = [
  "Business Name",
  "Applicant Info",
  "Business Details",
  "Documents",
  "Review",
  "Confirmation",
];

export function RegistrationForm() {
  const { currentStep, nextStep, previousStep } = useRegistrationStore();
  const store = useRegistrationStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const hasHydrated = useRegistrationStore((state) => state.hasHydrated);

  // React.useEffect(() => {
  //   if (!hasHydrated) return;

  //   const params = new URLSearchParams(window.location.search);
  //   const reference = params.get("reference");
  //   const status = params.get("status");
  //   const { updateField, currentStep, paymentReference } =
  //     useRegistrationStore.getState();

  //   if (reference && status === "Successful") {
  //     updateField("paymentReference", reference);
  //     updateField("paymentStatus", "pending");
  //     updateField("currentStep", 5);
  //     updateField("completedSteps", [1, 2, 3, 4]);
  //     window.history.replaceState({}, "", "/register");
  //     return;
  //   }
  // }, [hasHydrated]);

  React.useEffect(() => {
    if (!hasHydrated) return;
    const docFields = [
      "supportingDocBase64",
      "signatureBase64",
      "meansOfIdBase64",
      "passportBase64",
    ] as const;
    import("@/lib/document-storage")
      .then(({ getAllDocuments }) =>
        getAllDocuments().then((docs) => {
          const state = useRegistrationStore.getState();
          for (const field of docFields) {
            if (docs[field] && !(state as any)[field]) {
              state.updateField(field, docs[field].data);
            }
          }
        }),
      )
      .catch(() => {});
  }, [hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1: // Business Name
        return store.selectedBusinessName !== "";

      case 2: // Applicant Info
        if (store.applicantType === "individual") {
          return (
            store.firstName !== "" &&
            store.lastName !== "" &&
            validateDateOfBirth(store.dateOfBirth).isValid &&
            store.gender !== "" &&
            store.phone !== "" &&
            validateEmail(store.email).isValid &&
            store.residentialAddress !== ""
          );
        } else {
          return (
            store.organizationName !== "" &&
            store.rcNumber !== "" &&
            store.organizationEmail !== "" &&
            store.phone !== ""
          );
        }

      case 3: // Business Details
        return (
          store.businessActivity !== "" &&
          (!!store.sameAsResidential || store.businessAddress !== "") &&
          store.businessPhone !== "" &&
          validateEmail(store.businessEmail).isValid &&
          store.commencementDate !== ""
        );

      case 4: // Documents
        return (
          !!store.supportingDocBase64 &&
          !!store.signatureBase64 &&
          !!store.meansOfIdBase64 &&
          !!store.passportBase64
        );

      case 5: // Review
        // Review page validation handled internally, but require successful payment and submission
        return store.paymentStatus === "success" && store.submitted;

      default:
        return true;
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (isStepValid()) {
        nextStep();
        window.scrollTo(0, 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    previousStep();
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to restart? All your progress will be lost.",
    );
    if (!confirmed) return;

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore storage clearing errors
    }
    store.reset();
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NameAvailabilityStep />;
      case 2:
        return <ApplicantInfoStep />;
      case 3:
        return <BusinessDetailsStep />;
      case 4:
        return <DocumentUploadStep />;
      case 5:
        return <ReviewSummaryStep />;
      case 6:
        return <ConfirmationPageStep />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 6;
  const nextButtonText =
    currentStep === 5
      ? "Complete Registration"
      : isLastStep
        ? "Back to Home"
        : "Next";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={6}
            stepNames={STEPS}
          />

          {/* Form Content */}
          <div className="mt-12 animate-fade-in">{renderStep()}</div>

          {/* Navigation Buttons */}
          {!isLastStep && (
            <div className="mt-12 flex justify-between gap-4">
              <div className="flex items-center gap-3">
                {currentStep >= 2 && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors bg-destructive/10"
                    title="Restart"
                  >
                    <RotateCcw className="size-4" />
                    <span className="hidden md:block">Restart</span>
                  </button>
                )}

                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <ArrowLeft className="size-4" />
                  <span className="hidden md:block">Previous</span>
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={isLoading || !isStepValid()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next"
              >
                <span className="hidden md:block">
                  {isLoading ? "Processing..." : nextButtonText}
                </span>
                {!isLoading && <ArrowRight className="size-4" />}
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
  );
}
