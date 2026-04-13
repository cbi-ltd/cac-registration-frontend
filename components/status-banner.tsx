import { useRegistrationStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";

interface StatusBannerProps {
  isSubmitting?: boolean;
  submitted?: boolean;
  submissionError?: string;
}

const config = {
  pending: {
    title: "Payment Pending",
    description:
      "Your payment is pending. Please complete your payment to proceed.",
    icon: <Clock className="size-6 text-amber-600" />,
    color: "text-amber-800",
    backgroundColor: "bg-amber-50/50",
    descriptionColor: "text-amber-700",
  },
  initiating: {
    title: "Payment initiating...",
    description:
      "We are initiating your payment. Please wait while we process your payment.",
    icon: <Loader2 className="size-6 text-blue-600 animate-spin" />,
    color: "text-blue-800",
    backgroundColor: "bg-blue-50/50",
    descriptionColor: "text-blue-700",
  },
  submitting: {
    title: "Submitting Registration",
    description:
      "Payment confirmed. We're submitting your application to CAC — please don't close this page.",
    icon: <Loader2 className="size-6 text-blue-600 animate-spin" />,
    color: "text-blue-800",
    backgroundColor: "bg-blue-50/50",
    descriptionColor: "text-blue-700",
  },
  submitted: {
    title: "Application Submitted",
    description:
      "Your registration has been submitted successfully. Click Complete Registration to continue.",
    icon: <CheckCircle className="size-6 text-green-600" />,
    color: "text-green-800",
    backgroundColor: "bg-green-50/50",
    descriptionColor: "text-green-700",
  },
  success: {
    title: "Payment Successful",
    description: "Your payment was successful.",
    icon: <CheckCircle className="size-6 text-green-600" />,
    color: "text-green-800",
    backgroundColor: "bg-green-50/50",
    descriptionColor: "text-green-700",
  },
  failed: {
    title: "Payment Failed",
    description: "Your payment has failed. Please try again.",
    icon: <AlertCircle className="size-6 text-destructive" />,
    color: "text-destructive",
    backgroundColor: "bg-red-50/50",
    descriptionColor: "text-red-700",
  },
  submissionError: {
    title: "Submission Error",
    description: "Your submission has failed. Please try again.",
    icon: <AlertCircle className="size-6 text-destructive" />,
    color: "text-destructive",
    backgroundColor: "bg-red-50/50",
    descriptionColor: "text-red-700",
  },
};

export function StatusBanner({
  isSubmitting,
  submitted,
  submissionError,
}: StatusBannerProps) {
  const store = useRegistrationStore();

  const displayStatus: keyof typeof config = isSubmitting
    ? "submitting"
    : submitted
      ? "submitted"
      : submissionError
        ? "submissionError"
        : store.paymentStatus;

  const current = config[displayStatus];

  return (
    <div
      className={cn(
        "p-4 rounded-lg mb-4 animate-slide-up",
        current.backgroundColor,
      )}
    >
      <div className="flex items-center gap-4">
        {current.icon}
        <div>
          <p className={cn("text-sm font-medium", current.color)}>
            {current.title}
          </p>
          <p className={cn("text-sm", current.descriptionColor)}>
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
}
