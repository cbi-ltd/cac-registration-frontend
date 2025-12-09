import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface RegistrationData {
  // Step 1: Name availability
  preferredNames: string[]
  selectedBusinessName: string

  // Step 2: Applicant Information
  applicantType: "individual" | "organization"

  // Individual fields
  title: string
  firstName: string
  middleName: string
  lastName: string

  // Organization fields
  organizationName: string
  rcNumber: string
  organizationEmail: string

  // Common fields
  dateOfBirth: string
  gender: "male" | "female" | ""
  nationality: string
  phone: string
  email: string
  residentialAddress: string

  // Step 3: Identification
  idType: string
  idNumber: string
  idIssueDate: string
  idExpiryDate: string
  idDocument: File | null
  passportPhoto: File | null

  // Step 4: Business Details
  businessActivity: string
  businessActivityCode: string
  natureOfBusiness: string
  businessAddress: string
  sameAsResidential: boolean
  businessPhone: string
  businessEmail: string
  commencementDate: string

  // Step 5: Documents
  proofOfAddress: File | null
  consentLetter: File | null

  // Step 6: Payment
  paymentStatus: "pending" | "processing" | "success" | "failed"
  paymentReference: string
  paymentError: string

  // Meta
  currentStep: number
  completedSteps: number[]
  applicationId: string
  applicationReference: string
}

const initialState: RegistrationData = {
  preferredNames: ["", "", ""],
  selectedBusinessName: "",
  applicantType: "individual",
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  organizationName: "",
  rcNumber: "",
  organizationEmail: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  phone: "",
  email: "",
  residentialAddress: "",
  idType: "",
  idNumber: "",
  idIssueDate: "",
  idExpiryDate: "",
  idDocument: null,
  passportPhoto: null,
  businessActivity: "",
  businessActivityCode: "",
  natureOfBusiness: "",
  businessAddress: "",
  sameAsResidential: true,
  businessPhone: "",
  businessEmail: "",
  commencementDate: "",
  proofOfAddress: null,
  consentLetter: null,
  paymentStatus: "pending",
  paymentReference: "",
  paymentError: "",
  currentStep: 1,
  completedSteps: [],
  applicationId: "",
  applicationReference: "",
}

export const useRegistrationStore = create<
  RegistrationData & {
    updateField: (field: string, value: any) => void
    nextStep: () => void
    previousStep: () => void
    markStepComplete: (step: number) => void
    reset: () => void
  }
>(
  persist(
    (set) => ({
      ...initialState,
      updateField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
          completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
        })),
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),
      reset: () => set(initialState),
    }),
    {
      name: "cbi-registration",
    },
  ),
)
