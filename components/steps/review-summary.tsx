"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store";
import { FormSection } from "@/components/form-section";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { StatusBanner } from "@/components/status-banner";

export function ReviewSummaryStep() {
  const store = useRegistrationStore();
  const [errors, setErrors] = React.useState<string[]>([]);
  const amount: number = 500;
  // const amount: number = 29000
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [checkMessage, setCheckMessage] = React.useState("");
  const [checkError, setCheckError] = React.useState("");
  const [submitted, setSubmitted] = React.useState<boolean>(
    () => !!store.applicationId,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [submissionError, setSubmissionError] = React.useState("");

  const validateSubmission = (): boolean => {
    const newErrors: string[] = [];

    if (!store.selectedBusinessName)
      newErrors.push("Business name not selected");

    if (store.applicantType === "individual") {
      if (!store.firstName || !store.lastName)
        newErrors.push("Applicant name incomplete");
      if (!store.email && !store.phone)
        newErrors.push("Contact information incomplete");
    } else {
      if (!store.organizationName)
        newErrors.push("Organization name not provided");
      if (!store.rcNumber) newErrors.push("RC number not provided");
      if (!store.phone) newErrors.push("Phone number not provided");
    }

    if (!store.businessActivity)
      newErrors.push("Business activity not selected");

    if (!store.commencementDate)
      newErrors.push("Business commencement date not set");

    if (!store.supportingDocBase64 || !store.signatureBase64)
      newErrors.push("Supporting documents not uploaded");

    if (!store.meansOfIdBase64 || !store.passportBase64)
      newErrors.push("ID or passport missing");

    if (!store.termsAccepted)
      newErrors.push("Terms and conditions must be accepted");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const checkPaymentStatus = React.useCallback(
    async (reference?: string) => {
      setCheckError("");
      setCheckMessage("");

      const paymentReference = reference || store.paymentReference;

      if (!paymentReference) {
        setCheckError(
          "No payment reference available. Complete payment first.",
        );
        return;
      }

      setChecking(true);

      try {
        const resp = await fetch(
          `https://cac-registration-backend.onrender.com/api/payments/checkout/status/${paymentReference}`,
        );

        if (!resp.ok) throw new Error("Failed to fetch payment status");

        const json = await resp.json();

        const status = (
          json?.data?.data?.status ||
          json?.data?.status ||
          json?.status ||
          ""
        )
          .toString()
          .toLowerCase();

        if (status) {
          store.updateField("paymentStatus", status);
          setCheckMessage(`Payment status: ${status}`);

          if (status === "success") {
            // submit registration payload to backend, then mark submitted and advance
            setIsSubmitting(true);
            try {
              const result = await store.submitRegistration();

              if (result?.data?.message === "application received") {
                setSubmitted(true);
                store.updateField("submitted", true);
              } else {
                const msg =
                  "Submission failed: " +
                  (result?.data?.message || "Unknown error");
                setCheckError(msg);
                setSubmissionError(msg);
              }
            } catch (err: any) {
              const msg = err?.message || "Submission after payment failed";
              setCheckError(msg);
              setSubmissionError(msg);
            } finally {
              setIsSubmitting(false);
            }
          }
        } else {
          setCheckError("Payment status not available");
        }
      } catch (err: any) {
        setCheckError(err?.message || "Unable to check payment status");
        console.log(err.message);
      } finally {
        setChecking(false);
      }
    },
    [store.updateField, store.submitRegistration, store.paymentReference],
  );

  const initiatePayment = async () => {
    setErrors([]);

    if (!validateSubmission()) return;

    const newTab = window.open("", "_blank");

    setIsProcessingPayment(true);

    try {
      const payload = {
        amount: amount,
        walletId: "master",
        currency: "NGN",
        metdata: {},
      };

      const resp = await fetch(
        "https://cac-registration-backend.onrender.com/api/payments/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!resp.ok) {
        newTab?.close();
        setErrors([`Payment initialization failed: ${resp.status}`]);
        return;
      }

      const json = await resp.json();
      const authUrl = json?.checkout?.data?.authorization_url;
      // store.updateField("paymentReference", json?.checkout?.data?.reference);
      // store.paymentReference = json?.checkout?.data?.reference;
      const ref = json?.checkout?.data?.reference;
      store.updateField("paymentReference", ref);
      store.updateField("paymentStatus", "pending");

      if (!authUrl) {
        newTab?.close();
        setErrors(["Payment initialization failed: missing authorization URL"]);
        return;
      }

      // Mark that an external payment flow is in progress so we can resume after redirect
      // try {
      //   localStorage.setItem("externalPaymentPending", "true");
      // } catch (e) {
      //   // ignore
      // }

      // localStorage.setItem(
      //   "cbi-payment-pending",
      //   JSON.stringify({
      //     reference: ref,
      //     step: 5,
      //     timestamp: Date.now(),
      //   }),
      // );

      // Redirect user to the payment provider
      // window.location.href = authUrl
      // window.open(authUrl, "_blank");
      newTab!.location.href = authUrl as string;
      setIsProcessingPayment(false);
      checkPaymentStatus(ref);
      // Note: Page will unload, so finally block won't execute as expected
    } catch (err: any) {
      newTab?.close();
      setErrors(["Unable to initialize payment. Please try again."]);
      setIsProcessingPayment(false);
    }
  };

  React.useEffect(() => {
    if (
      submitted ||
      !store.paymentReference ||
      store.paymentStatus === "success" ||
      store.paymentStatus === "failed"
    )
      return;
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [
    submitted,
    store.paymentReference,
    store.paymentStatus,
    checkPaymentStatus,
  ]);

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
              {
                label: "Full Name",
                value:
                  `${store.firstName} ${store.middleName} ${store.lastName}`.trim(),
              },
              { label: "Date of Birth", value: store.dateOfBirth },
              { label: "Email", value: store.email },
              { label: "Phone", value: store.phone },
              { label: "Nationality", value: store.nationality },
              { label: "Gender", value: store.gender },
              // { label: "Residential Address", value: store.residentialAddress },
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
          value: store.sameAsResidential
            ? "Same as residential"
            : store.businessAddress,
        },
      ],
    },
  ];

  const retrySubmission = async () => {
    setErrors([]);
    if (!validateSubmission()) return;
    setSubmissionError("");
    setCheckMessage("");

    setIsSubmitting(true);

    try {
      const result = await store.submitRegistration();

      if (result?.data?.message === "application received") {
        setSubmitted(true);
        store.updateField("submitted", true);
      } else {
        setSubmissionError(result?.data?.message || "Unknown error");
      }
    } catch (err: any) {
      setSubmissionError(err?.message || "Submission after payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Review Your Application"
        description="Please review all information before proceeding to payment. Click Previous to make changes."
        icon={<CheckCircle2 className="size-5 text-primary" />}
      >
        <div className="space-y-6">
          {summaryData.map((section) => (
            <div key={section.section} className="space-y-3">
              <h3 className="font-semibold text-foreground text-lg">
                {section.section}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {item.value || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Documents Uploaded
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                {
                  name: "Supporting Document",
                  uploaded: !!store.supportingDocBase64,
                },
                {
                  name: "Signature (scanned)",
                  uploaded: !!store.signatureBase64,
                },
                { name: "Means of ID", uploaded: !!store.meansOfIdBase64 },
                { name: "Passport Photo", uploaded: !!store.passportBase64 },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${doc.uploaded ? "bg-green-600" : "bg-destructive"}`}
                  />
                  <span className="text-sm text-foreground">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Fee Summary */}
      <FormSection
        title="Total Amount Due"
        description="Make use of bank transfer where possible and not card payment."
      >
        <div className="space-y-3">
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">
              CAC Registration Fee
            </span>
            <span className="font-bold text-lg text-primary">₦{amount}</span>
          </div>
        </div>
      </FormSection>

      {/* Terms & Conditions */}
      <FormSection title="Terms & Conditions" isRequired>
        <div className="space-y-3">
          {[
            "I confirm that all information provided is accurate and truthful",
            // "I understand this registration is with the Corporate Affairs Commission (CAC)",
            // "I understand that registration fees are non-refundable",
            // "I consent to the processing of my personal data in accordance with privacy laws",
            // "I authorize CBI Technologies to submit this application on my behalf",
          ].map((term, index) => (
            <label
              key={index}
              className="flex items-start md:items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={store.termsAccepted}
                onChange={(e) =>
                  store.updateField("termsAccepted", e.target.checked)
                }
                className="size-4"
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
            <AlertCircle className="size-5 text-destructive" />
            <span className="font-medium text-destructive">
              Please fix the following before submitting:
            </span>
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
          You'll be redirected to secure payment. Your application will be
          submitted to CAC after successful payment.
        </p>
      </div>

      {!store.applicationId && store.paymentStatus !== "success" && (
        <button
          type="button"
          onClick={initiatePayment}
          disabled={
            isProcessingPayment ||
            isSubmitting ||
            store.paymentStatus === "initiating"
          }
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
        >
          {isProcessingPayment ? "Redirecting to payment..." : `Pay ₦${amount}`}
        </button>
      )}

      {submissionError && !submitted && (
        <button
          type="button"
          onClick={retrySubmission}
          disabled={isSubmitting}
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Retry Submission"
          )}
        </button>
      )}

      {store.paymentReference && (
        <>
          {/* <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <p className="text-xs text-muted-foreground">Payment status</p>
            <p className="text-sm font-medium text-foreground">
              {store.paymentStatus || "checking..."}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <p className="text-xs text-muted-foreground">Document submitted</p>
            <p className="text-sm font-medium text-foreground">
              {submitted ? "Yes" : "No"}
            </p>
          </div> */}
          <StatusBanner
            isSubmitting={isSubmitting}
            submitted={submitted}
            submissionError={submissionError}
          />

          {checkError && (
            <p className="text-sm text-destructive">{checkError}</p>
          )}
        </>
      )}

      <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
