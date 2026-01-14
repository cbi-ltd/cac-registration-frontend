import { create } from "zustand"
import { persist } from "zustand/middleware"

// Base API URL for all backend requests
export const API_BASE_URL = "https://cac-registration-backend.onrender.com/api/merchant/"

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
  sameAsResidential: string
  businessPhone: string
  businessEmail: string
  commencementDate: string

  // Step 5: Documents
  proofOfAddress: File | null
  // consentLetter: File | null

  // Step 6: Payment
  paymentStatus: "pending"|"initiating" | "success" | "failed"
  paymentReference: string
  paymentError: string

  // Meta
  currentStep: number
  completedSteps: number[]
  applicationId: string
  applicationReference: string
  // optional base64 document fields when backend provides encoded docs
  supportingDocBase64?: string | null
  signatureBase64?: string | null
  meansOfIdBase64?: string | null
  passportBase64?: string | null
}

const initialState: RegistrationData = {
  preferredNames: ["", ""],
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
  sameAsResidential: "",
  businessPhone: "",
  businessEmail: "",
  commencementDate: "",
  proofOfAddress: null,
  // consentLetter: null,
  paymentStatus: "pending",
  paymentReference: "",
  paymentError: "",
  currentStep: 1,
  completedSteps: [],
  applicationId: "",
  applicationReference: "",
  supportingDocBase64: null,
  signatureBase64: null,
  meansOfIdBase64: null,
  passportBase64: null,
}

// Helper to build backend payload from store data (steps 2-4)
function buildSubmissionPayload(storeObj: any) {
  // Helper to extract street number if available from an address string
  const extractStreetNumber = (addr: string) => {
    if (!addr || typeof addr !== "string") return ""
    const parts = addr.trim().split(/\s+/)
    return parts.length && /^\d+/.test(parts[0]) ? parts[0] : ""
  }

  const body: any = {
    lineOfBusiness: storeObj.businessActivity ?? storeObj.natureOfBusiness ?? "",
    proprietorCity: storeObj.proprietorCity ?? storeObj.proprietorCity ?? storeObj.residentialCity ?? "",
    companyCity: storeObj.companyCity ?? storeObj.companyCity ?? "",
    proprietorPhonenumber: storeObj.phone ?? storeObj.proprietorPhonenumber ?? "",
    businessCommencementDate: storeObj.commencementDate ?? storeObj.commencementDate ?? "",
    companyState: storeObj.companyState ?? "",
    proprietorNationality: storeObj.nationality ?? storeObj.proprietorNationality ?? "",
    proprietorState: storeObj.proprietorState ?? "",
    proprietorDob: storeObj.dateOfBirth ?? storeObj.proprietorDob ?? "",
    proprietorFirstname: storeObj.firstName ?? "",
    proprietorOthername: storeObj.middleName ?? storeObj.proprietorOthername ?? "",
    proprietorSurname: storeObj.lastName ?? "",
    proposedOption1: storeObj.selectedBusinessName ?? storeObj.preferredNames?.[0] ?? "",
    proprietorGender: (storeObj.gender ?? "").toString().toUpperCase() ?? "",
    proprietorStreetNumber: storeObj.proprietorStreetNumber ?? extractStreetNumber(storeObj.residentialAddress ?? ""),
    proprietorServiceAddress: storeObj.residentialAddress ?? "",
    companyEmail: storeObj.businessEmail ?? storeObj.companyEmail ?? "",
    companyStreetNumber: storeObj.companyStreetNumber ?? extractStreetNumber(storeObj.businessAddress ?? ""),
    proprietorEmail: storeObj.email ?? storeObj.proprietorEmail ?? "",
    companyAddress: storeObj.businessAddress ?? "",
    proprietorPostcode: storeObj.proprietorPostcode ?? "",
    proprietorLga: storeObj.proprietorLga ?? "",
    // transactionRef will be populated from paymentReference/applicationReference but should not be exposed in UI
    transactionRef: storeObj.paymentReference ?? storeObj.applicationReference ?? "VAS34500236",
    supportingDoc: storeObj.supportingDocBase64 ?? storeObj.supportingDoc ?? null,
    signature: storeObj.signatureBase64 ?? storeObj.signature ?? null,
    meansOfId: storeObj.meansOfIdBase64 ?? storeObj.meansOfId ?? null,
    passport: storeObj.passportBase64 ?? storeObj.passport ?? null,
  }

  return body
}

export const useRegistrationStore = create<
  RegistrationData & {
    updateField: (field: string, value: any) => void
    nextStep: () => void
    previousStep: () => void
    markStepComplete: (step: number) => void
    reset: () => void
    loadFromApi: (data: any) => void
    submitRegistration: (overridePayload?: Partial<RegistrationData>) => Promise<any>
  }
>(
  persist(
    (set) => ({
      ...initialState,
      // Populate store fields from backend API response shape
      loadFromApi: (data: any) =>
        set((state: any) => ({
          // map known fields from backend response to store
          businessActivity: data.lineOfBusiness ?? state.businessActivity,
          commencementDate: data.businessCommencementDate ?? state.commencementDate,
          businessAddress: data.companyAddress ?? state.businessAddress,
          businessEmail: data.companyEmail ?? state.businessEmail,
          businessPhone: data.proprietorPhonenumber ?? state.businessPhone,
          selectedBusinessName: data.proposedOption1 ?? state.selectedBusinessName,
          // proprietor -> applicant fields
          firstName: data.proprietorFirstname ?? state.firstName,
          middleName: data.proprietorOthername ?? state.middleName,
          lastName: data.proprietorSurname ?? state.lastName,
          dateOfBirth: data.proprietorDob ?? state.dateOfBirth,
          gender: (data.proprietorGender ?? state.gender)?.toLowerCase() === "male" ? "male" : "female",
          nationality: data.proprietorNationality ?? state.nationality,
          phone: data.proprietorPhonenumber ?? state.phone,
          email: data.proprietorEmail ?? state.email,
          residentialAddress: `${data.proprietorStreetNumber ?? ""} ${data.proprietorServiceAddress ?? ""} ${data.proprietorCity ?? ""}`.trim(),
          // transaction and document base64
          applicationReference: data.transactionRef ?? state.applicationReference,
          supportingDocBase64: data.supportingDoc ?? state.supportingDocBase64,
          signatureBase64: data.signature ?? state.signatureBase64,
          meansOfIdBase64: data.meansOfId ?? state.meansOfIdBase64,
          passportBase64: data.passport ?? state.passportBase64,
        })),

      // Submit registration payload to backend endpoint
      submitRegistration: async (overridePayload?: Partial<RegistrationData>) => {
        let result: any = null
        try {
          // If an override payload is provided, prefer it. Otherwise read persisted store from sessionStorage
          let storeObj: any = overridePayload ? { ...overridePayload } : {}

          if (!overridePayload) {
            const raw = sessionStorage.getItem("cbi-registration")
            let parsed: any = {}
            if (raw) {
              try {
                parsed = JSON.parse(raw)
              } catch (e) {
                parsed = {}
              }
            }
            storeObj = parsed
          }

          const body = buildSubmissionPayload(storeObj)

          const resp = await fetch(`${API_BASE_URL}reg-bn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })

          if (!resp.ok) throw new Error("Registration submission failed")

          result = await resp.json()
          // Optionally update store from response
          set((s: any) => ({ applicationId: result?.data?.data?.rcNumber ?? s.applicationId }))
        } catch (err) {
          throw err
        }

        return result
      },
      updateField: (field: any, value: any) =>
        set((state: any) => ({
          ...state,
          [field]: value,
        })),
      nextStep: () =>
        set((state: any) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
          completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
        })),
      previousStep: () =>
        set((state: any) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
      markStepComplete: (step: number) =>
        set((state: any) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),
      reset: () => set(initialState),
    }),
    {
      name: "cbi-registration",
    },
  ) as any,
)
