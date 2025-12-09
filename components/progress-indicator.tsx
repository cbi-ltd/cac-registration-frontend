"use client"

import { CheckCircle2 } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  number: number
  totalSteps: number
  stepNames: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, stepNames }: ProgressIndicatorProps) {
  const progressPercentage = totalSteps === 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full py-8 px-4 sm:px-6">
      <div className="relative max-w-4xl md:mx-auto overflow-x-auto">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-muted/60 rounded-full" />

        {/* Progress Fill */}
        <div
          className="absolute left-0 top-5 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1
            const isComplete = stepNum < currentStep
            const isCurrent = stepNum === currentStep

            return (
              <div key={stepNum} className="flex flex-col items-center flex-1 max-w-[140px]">
                <div className="relative">
                  {/* Pulse effect for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/30 -z-[-1]" />
                  )}

                  <div
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg ${
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110"
                          : "bg-background text-muted-foreground border-2 border-muted"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
                  </div>
                </div>

                {/* Step Label - responsive & wraps nicely */}
                <span
                  className={`mt-3 text-xs sm:text-sm font-medium text-center leading-tight px-1 transition-colors ${
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

      {/* Step Counter - hidden on very small screens if needed */}
      <div className="mt-10 text-center text-sm text-muted-foreground">
        Step <span className="font-semibold text-foreground">{currentStep}</span> of {totalSteps}
      </div>
    </div>
  )
}


// "use client"

// import { CheckCircle2 } from "lucide-react"

// interface ProgressIndicatorProps {
//   currentStep: number
//   totalSteps: number
//   stepNames: string[]
// }

// export function ProgressIndicator({ currentStep, totalSteps, stepNames }: ProgressIndicatorProps) {
//   return (
//     <div className="w-full py-8">
//       <div className="flex items-center justify-between mb-6">
//         {Array.from({ length: totalSteps }).map((_, index) => {
//           const stepNum = index + 1
//           const isComplete = stepNum < currentStep
//           const isCurrent = stepNum === currentStep

//           return (
//             <div key={stepNum} className="flex items-center flex-1">
//               <div className="flex flex-col items-center flex-1">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                     isComplete
//                       ? "bg-primary text-primary-foreground"
//                       : isCurrent
//                         ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
//                         : "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {isComplete ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
//                 </div>
//                 <span className="text-xs font-medium mt-2 text-center max-w-20">{stepNames[index]}</span>
//               </div>
//               {stepNum < totalSteps && (
//                 <div
//                   className={`h-1 flex-1 mx-2 rounded-full transition-colors ${isComplete ? "bg-primary" : "bg-muted"}`}
//                 />
//               )}

//             </div>
//           )
//         })}
//       </div>

//       {/* Step Counter */}
//       <div className="text-center text-sm text-muted-foreground">
//         Step {currentStep} of {totalSteps}
//       </div>
//     </div>
//   )
// }
