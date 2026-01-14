"use client"

import { CheckCircle2 } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepNames: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, stepNames }: ProgressIndicatorProps) {
  const progressPercentage = totalSteps === 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full py-6 px-3 sm:px-6">
      <div className="relative mx-auto">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-4 sm:top-5 h-1 bg-muted/60 rounded-full" />

        {/* Progress Fill */}
        <div
          className="absolute left-0 top-4 sm:top-5 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps - with gap adjustment for mobile */}
        <div className="relative flex justify-between gap-3 sm:gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1
            const isComplete = stepNum < currentStep
            const isCurrent = stepNum === currentStep

            return (
              <div key={stepNum} className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  {/* Pulse effect for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}

                  <div
                    className={`relative z-10 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg flex-shrink-0 ${
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110"
                          : "bg-background text-muted-foreground border-2 border-muted"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : stepNum}
                  </div>
                </div>

                {/* Step Label - truncated on mobile, full on larger screens */}
                <span
                  className={`hidden sm:block mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center leading-tight px-1 transition-colors line-clamp-2 ${
                    isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stepNames[index]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Counter */}
      <div className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-muted-foreground">
        Step <span className="font-semibold text-foreground">{currentStep}</span> of {totalSteps}
      </div>
    </div>
  )
}

