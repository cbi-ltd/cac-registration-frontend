"use client";

import React from "react";
import { API_BASE_URL, useRegistrationStore } from "@/lib/store";
import { FormSection } from "@/components/form-section";
import { FormInput } from "@/components/form-input";
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";

export function NameAvailabilityStep() {
  const store = useRegistrationStore();
  const [responseMessage, setResponseMessage] = React.useState("");
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState("");
  const [proposedName, setProposedName] = React.useState("");
  const [lineOfBusiness, setLineOfBusiness] = React.useState("");
  const [recommendedMessage, setRecommendedMessage] = React.useState("");
  const [recommendedKeywords, setRecommendedKeywords] = React.useState<
    string[]
  >([]);
  const [suggestedNames, setSuggestedNames] = React.useState<string[]>([]);

  const handleProposedNameChange = (value: string) =>
    setProposedName(value.toLocaleUpperCase());

  const handleLineOfBusinessChange = (value: string) =>
    setLineOfBusiness(value);

  const checkAvailability = async () => {
    if (!proposedName.trim()) {
      setError("Please enter a proposed business name");
      return;
    }

    setIsChecking(true);
    setError("");
    setResponseMessage("");
    setRecommendedMessage("");
    setRecommendedKeywords([]);
    setSuggestedNames([]);

    try {
      const resp = await fetch(`${API_BASE_URL}check-bn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedName: proposedName.trim(),
          lineOfBusiness: lineOfBusiness.trim(),
        }),
      });

      if (!resp.ok) {
        return resp.json().then((data) => {
          setError(
            data.error?.message ||
              "Failed to check availability. Please try again.",
          );
          return;
        });
      }

      const json = await resp.json();

      /**
       * Normalize backend response
       */
      const apiMessage = json?.data?.data?.message ?? json?.data?.message ?? "";

      const recommendedActions =
        json?.data?.data?.data?.recommendedActions ??
        json?.data?.data?.recommendedActions ??
        json?.data?.recommendedActions ??
        [];

      const availableNames = json?.data?.data?.data?.suggestedNames ?? [];

      /**
       * Extract recommendations (if any)
       */
      if (Array.isArray(recommendedActions) && recommendedActions.length > 0) {
        setRecommendedMessage(recommendedActions[0]?.message ?? "");
        setRecommendedKeywords(recommendedActions[0]?.keywords ?? []);
      }

      if (Array.isArray(availableNames) && availableNames.length > 0) {
        setSuggestedNames(availableNames);
      }

      /**
       * Determine final status
       */
      const finalStatus = apiMessage || recommendedActions?.[0]?.message || "";

      setResponseMessage(finalStatus);

      /**
       * STRICT RULE:
       * Only store name if explicitly approved
       */
      if (finalStatus === "PROCEED_TO_FILING") {
        store.updateField("selectedBusinessName", proposedName.trim());
      } else {
        store.updateField("selectedBusinessName", "");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to check availability. Please try again.",
      );
      store.updateField("selectedBusinessName", "");
    } finally {
      setIsChecking(false);
    }
  };

  const canProceed = responseMessage === "PROCEED_TO_FILING";

  return (
    <div className="space-y-6 animate-slide-up">
      <FormSection
        title="Business Name Availability Check"
        description="Enter up to 1 preferred business names. We'll check their availability against CAC records."
        isRequired
      >
        <div className="space-y-3">
          <FormInput
            label={`Proposed Name`}
            placeholder="e.g., ABC Technology Services"
            value={proposedName}
            onChange={(e) => handleProposedNameChange(e.target.value)}
            maxLength={100}
            tooltip="Enter the exact proposed business name to check"
          />

          <FormInput
            label={`Line Of Business`}
            placeholder="e.g., Information Technology, Retail"
            value={lineOfBusiness}
            onChange={(e) => handleLineOfBusinessChange(e.target.value)}
            maxLength={100}
            tooltip="Provide the business activity or industry"
          />
        </div>

        <button
          onClick={checkAvailability}
          disabled={isChecking}
          className="w-full border border-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Check Name Availability"
        >
          {!isChecking && <Search className="size-4" />}
          {isChecking ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Check Availability"
          )}
        </button>
      </FormSection>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="size-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {responseMessage && (
        <FormSection title="Availability Results" description="">
          <div className="p-4 rounded-lg bg-muted/5 border border-muted/20">
            {/* <p className="text-sm">{responseMessage === "Name is unique but check the similarity details" ? "Name is unique" : responseMessage}</p> */}
            <p className="text-sm">
              {responseMessage === "PROCEED_TO_FILING"
                ? "Proposed name is available"
                : responseMessage.replaceAll("_", " ")}
            </p>
          </div>
        </FormSection>
      )}

      {(recommendedMessage ||
        (recommendedKeywords && recommendedKeywords.length > 0)) && (
        <FormSection title="Recommendations" description="">
          <div className="p-4 rounded-lg bg-muted/5 border border-muted/20 space-y-2">
            {recommendedMessage && (
              <p className="text-sm">{recommendedMessage}</p>
            )}
            {recommendedKeywords && recommendedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendedKeywords.map((k) => (
                  <span
                    key={k}
                    className="text-xs px-2 py-1 rounded bg-secondary/10 border border-secondary/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
            {suggestedNames && suggestedNames.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm">
                  You can choose any of these suggested names below.
                </p>
                <span className="flex flex-wrap gap-2 mt-2">
                  {suggestedNames.map((name) => (
                    <span
                      key={name}
                      className="text-xs px-2 py-1 rounded bg-secondary/10 border border-secondary/20"
                    >
                      {name}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </FormSection>
      )}

      {canProceed && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800 flex items-start gap-3">
          <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Name Selected
            </p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              You've selected <strong>"{store.selectedBusinessName}"</strong>.
              Click Next to continue with applicant information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
