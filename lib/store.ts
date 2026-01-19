import { create } from "zustand"
import { persist } from "zustand/middleware"

export const API_BASE_URL =
  "https://cac-registration-backend.onrender.com/api/merchant/"

/* ===================== TYPES ===================== */

export interface RegistrationData {
  preferredNames: string[]
  selectedBusinessName: string

  applicantType: "individual" | "organization"

  title: string
  firstName: string
  middleName: string
  lastName: string

  organizationName: string
  rcNumber: string
  organizationEmail: string

  dateOfBirth: string
  gender: "male" | "female" | ""
  nationality: string
  phone: string
  email: string
  residentialAddress: string

  idType: string
  idNumber: string
  idIssueDate: string
  idExpiryDate: string
  idDocument: File | null
  passportPhoto: File | null

  businessActivity: string
  businessActivityCode: string
  natureOfBusiness: string
  businessAddress: string
  companyCity: string
  companyState: string
  companyStreetNumber: string

  sameAsResidential: string
  businessPhone: string
  businessEmail: string
  commencementDate: string

  proofOfAddress: File | null

  paymentStatus: "pending" | "initiating" | "success" | "failed"
  paymentReference: string
  paymentError: string
  submitted: boolean

  currentStep: number
  completedSteps: number[]
  applicationId: string
  applicationReference: string

  proprietorCity: string
  proprietorState: string
  proprietorPostcode: string
  proprietorLga: string
  proprietorStreetNumber: string

  supportingDocBase64?: string | null
  signatureBase64?: string | null
  meansOfIdBase64?: string | null
  passportBase64?: string | null
}

/* ===================== INITIAL STATE ===================== */

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
  companyCity: "",
  companyState: "",
  companyStreetNumber: "",

  sameAsResidential: "",
  businessPhone: "",
  businessEmail: "",
  commencementDate: "",
  proofOfAddress: null,
  paymentStatus: "pending",
  paymentReference: "",
  paymentError: "",
  submitted: false,
  currentStep: 1,
  completedSteps: [],
  applicationId: "",
  applicationReference: "",

  proprietorCity: "",
  proprietorState: "",
  proprietorPostcode: "",
  proprietorLga: "",
  proprietorStreetNumber: "",

  supportingDocBase64: null,
  signatureBase64: null,
  meansOfIdBase64: null,
  passportBase64: null,
}

/* ===================== HELPERS ===================== */

const extractStreetNumber = (addr = "") => {
  const parts = addr.trim().split(/\s+/)
  return /^\d+/.test(parts[0]) ? parts[0] : ""
}

const appendIfExists = (
  fd: FormData,
  key: string,
  value?: string | Blob | null
) => {
  if (value !== undefined && value !== null && value !== "") {
    fd.append(key, value)
  }
}

const generateApplicationReference = (length = 9): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}
console.log("Generated application reference:", generateApplicationReference(9))
const base64ToFile = (
  base64: string,
  filename: string
): File => {
  const [meta, data] = base64.split(",")
  const mime = meta.match(/:(.*?);/)?.[1] || "application/octet-stream"

  const binary = atob(data)
  const array = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }

  return new File([array], filename, { type: mime })
}


/* ===================== FORM DATA BUILDER ===================== */

const buildSubmissionPayload = (data: Partial<RegistrationData>) => {
  const fd = new FormData()

  appendIfExists(
    fd,
    "lineOfBusiness",
    data.businessActivity || data.natureOfBusiness
  )
  appendIfExists(fd, "proprietorFirstname", data.firstName)
  appendIfExists(fd, "proprietorOthername", data.middleName)
  appendIfExists(fd, "proprietorSurname", data.lastName)
  appendIfExists(fd, "proprietorEmail", data.email)
  appendIfExists(fd, "proprietorPhonenumber", data.phone)
  appendIfExists(fd, "proprietorNationality", data.nationality)
  appendIfExists(fd, "proprietorDob", data.dateOfBirth)
  appendIfExists(fd, "proprietorGender", data.gender?.toUpperCase())

  appendIfExists(fd, "proprietorStreetNumber",
    extractStreetNumber(data.proprietorStreetNumber)
  )
  appendIfExists(fd, "proprietorServiceAddress", data.residentialAddress)

  appendIfExists(fd, "companyAddress", data.businessAddress)
  appendIfExists(fd, "companyEmail", data.businessEmail)
  appendIfExists(fd, "companyCity", data.companyCity)
  appendIfExists(fd, "companyState", data.companyState)
  appendIfExists(fd, "companyStreetNumber", data.companyStreetNumber)
  appendIfExists(fd, "businessCommencementDate", data.commencementDate)

  appendIfExists(
    fd,
    "proposedOption1",
    data.selectedBusinessName || data.preferredNames?.[0]
  )

  // appendIfExists(
  //   fd,
  //   "transactionRef",
  //   data.paymentReference || data.applicationReference
  // )

  const transactionRef =
  // data.paymentReference ||
  // data.applicationReference ||
  generateApplicationReference(9)

  appendIfExists(fd, "transactionRef", transactionRef)


  appendIfExists(fd, "proprietorCity", data.proprietorCity)
  appendIfExists(fd, "proprietorState", data.proprietorState)
  appendIfExists(fd, "proprietorPostcode", data.proprietorPostcode)
  appendIfExists(fd, "proprietorLga", data.proprietorLga)

  // appendIfExists(fd, "supportingDoc", data.supportingDocBase64)
  // appendIfExists(fd, "signature", data.signatureBase64)
  // appendIfExists(fd, "meansOfId", data.meansOfIdBase64)
  // appendIfExists(fd, "passport", data.passportBase64)
  if (data.supportingDocBase64) {
    fd.append(
      "supportingDoc",
      base64ToFile(data.supportingDocBase64, "supporting-doc.png")
    )
  }

  if (data.signatureBase64) {
    fd.append(
      "signature",
      base64ToFile(data.signatureBase64, "signature.png")
    )
  }

  if (data.meansOfIdBase64) {
    fd.append(
      "meansOfId",
      base64ToFile(data.meansOfIdBase64, "means-of-id.png")
    )
  }

  if (data.passportBase64) {
    fd.append(
      "passport",
      base64ToFile(data.passportBase64, "passport.png")
    )
  }


  // console.log("FORM DATA:", [...fd.entries()])
  return fd
}

/* ===================== STORE ===================== */

export const useRegistrationStore = create<
  RegistrationData & {
    updateField: (field: keyof RegistrationData, value: any) => void
    nextStep: () => void
    previousStep: () => void
    submitRegistration: () => Promise<any>
    reset: () => void
  }
>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
          completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      submitRegistration: async () => {
        const state = get()
        const formData = buildSubmissionPayload(state)

        const resp = await fetch(`${API_BASE_URL}reg-bn`, {
          method: "POST",
          body: formData,
        })

        if (!resp.ok) {
          let errorMessage = `${resp.status}: ${resp.statusText}`
          try {
            const errorData = await resp.json()
            if (errorData.message) {
              errorMessage = errorData.message
            }
          } catch (e) {
            // If parsing JSON fails, use the default error message
          }
          throw new Error(errorMessage)
        }

        const result = await resp.json()

        set({
          applicationId: result?.data?.transactionRef,
          applicationReference: result?.data?.transactionRef,
        })

        return result
      },

      reset: () => set(initialState),
    }),
    {
      name: "cbi-registration",
      partialize: (state) => state, // persist full state safely
    }
  )
)




// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// // Base API URL for all backend requests
// export const API_BASE_URL = "https://cac-registration-backend.onrender.com/api/merchant/"

// export interface RegistrationData {
//   // Step 1: Name availability
//   preferredNames: string[]
//   selectedBusinessName: string

//   // Step 2: Applicant Information
//   applicantType: "individual" | "organization"

//   // Individual fields
//   title: string
//   firstName: string
//   middleName: string
//   lastName: string

//   // Organization fields
//   organizationName: string
//   rcNumber: string
//   organizationEmail: string

//   // Common fields
//   dateOfBirth: string
//   gender: "male" | "female" | ""
//   nationality: string
//   phone: string
//   email: string
//   residentialAddress: string

//   // Step 3: Identification
//   idType: string
//   idNumber: string
//   idIssueDate: string
//   idExpiryDate: string
//   idDocument: File | null
//   passportPhoto: File | null

//   // Step 4: Business Details
//   businessActivity: string
//   businessActivityCode: string
//   natureOfBusiness: string
//   businessAddress: string
//   sameAsResidential: string
//   businessPhone: string
//   businessEmail: string
//   commencementDate: string

//   // Step 5: Documents
//   proofOfAddress: File | null
//   // consentLetter: File | null

//   // Step 6: Payment
//   paymentStatus: "pending"|"initiating" | "success" | "failed"
//   paymentReference: string
//   paymentError: string
//   submitted: boolean

//   // Meta
//   currentStep: number
//   completedSteps: number[]
//   applicationId: string
//   applicationReference: string
//   // optional base64 document fields when backend provides encoded docs
//   supportingDocBase64?: string | null
//   signatureBase64?: string | null
//   meansOfIdBase64?: string | null
//   passportBase64?: string | null
// }

// const initialState: RegistrationData = {
//   preferredNames: ["", ""],
//   selectedBusinessName: "",
//   applicantType: "individual",
//   title: "",
//   firstName: "",
//   middleName: "",
//   lastName: "",
//   organizationName: "",
//   rcNumber: "",
//   organizationEmail: "",
//   dateOfBirth: "",
//   gender: "",
//   nationality: "",
//   phone: "",
//   email: "",
//   residentialAddress: "",
//   idType: "",
//   idNumber: "",
//   idIssueDate: "",
//   idExpiryDate: "",
//   idDocument: null,
//   passportPhoto: null,
//   businessActivity: "",
//   businessActivityCode: "",
//   natureOfBusiness: "",
//   businessAddress: "",
//   sameAsResidential: "",
//   businessPhone: "",
//   businessEmail: "",
//   commencementDate: "",
//   proofOfAddress: null,
//   // consentLetter: null,
//   paymentStatus: "pending",
//   paymentReference: "",
//   paymentError: "",
//   submitted: false,
//   currentStep: 1,
//   completedSteps: [],
//   applicationId: "",
//   applicationReference: "",
//   supportingDocBase64: null,
//   signatureBase64: null,
//   meansOfIdBase64: null,
//   passportBase64: null,
// }

// // Helper to build backend payload from store data (steps 2-4)
// function buildSubmissionPayload(storeObj: any) {
//   // Helper to extract street number if available from an address string
//   const extractStreetNumber = (addr: string) => {
//     if (!addr || typeof addr !== "string") return ""
//     const parts = addr.trim().split(/\s+/)
//     return parts.length && /^\d+/.test(parts[0]) ? parts[0] : ""
//   }

//   const body = new FormData()
  
//   // Text fields
//   body.append("lineOfBusiness", storeObj.businessActivity ?? storeObj.natureOfBusiness ?? "")
//   console.log("creating:", storeObj.natureOfBusiness);
//   body.append("proprietorCity", storeObj.proprietorCity ?? storeObj.residentialCity ?? "")
//   body.append("companyCity", storeObj.companyCity ?? "")
//   body.append("proprietorPhonenumber", storeObj.phone ?? storeObj.proprietorPhonenumber ?? "")
//   body.append("businessCommencementDate", storeObj.commencementDate ?? "")
//   body.append("companyState", storeObj.companyState ?? "")
//   body.append("proprietorNationality", storeObj.nationality ?? storeObj.proprietorNationality ?? "")
//   body.append("proprietorState", storeObj.proprietorState ?? "")
//   body.append("proprietorDob", storeObj.dateOfBirth ?? storeObj.proprietorDob ?? "")
//   body.append("proprietorFirstname", storeObj.firstName ?? "")
//   body.append("proprietorOthername", storeObj.middleName ?? storeObj.proprietorOthername ?? "")
//   body.append("proprietorSurname", storeObj.lastName ?? "")
//   body.append("proposedOption1", storeObj.selectedBusinessName ?? storeObj.preferredNames?.[0] ?? "")
//   body.append("proprietorGender", (storeObj.gender ?? "").toUpperCase())
//   body.append("proprietorStreetNumber", storeObj.proprietorStreetNumber ?? extractStreetNumber(storeObj.residentialAddress ?? ""))
//   body.append("proprietorServiceAddress", storeObj.residentialAddress ?? "")
//   body.append("companyEmail", storeObj.businessEmail ?? storeObj.companyEmail ?? "")
//   body.append("companyStreetNumber", storeObj.companyStreetNumber ?? extractStreetNumber(storeObj.businessAddress ?? ""))
//   body.append("proprietorEmail", storeObj.email ?? storeObj.proprietorEmail ?? "")
//   body.append("companyAddress", storeObj.businessAddress ?? "")
//   body.append("proprietorPostcode", storeObj.proprietorPostcode ?? "")
//   body.append("proprietorLga", storeObj.proprietorLga ?? "")
//   body.append("transactionRef", storeObj.paymentReference ?? storeObj.applicationReference ?? "VAS34500236")
  
//   // File fields
//   if (storeObj.supportingDocBase64 ?? storeObj.supportingDoc) {
//     body.append("supportingDoc", storeObj.supportingDocBase64 ?? storeObj.supportingDoc)
//   }
//   if (storeObj.signatureBase64 ?? storeObj.signature) {
//     body.append("signature", storeObj.signatureBase64 ?? storeObj.signature)
//   }
//   if (storeObj.meansOfIdBase64 ?? storeObj.meansOfId) {
//     body.append("meansOfId", storeObj.meansOfIdBase64 ?? storeObj.meansOfId)
//   }
//   if (storeObj.passportBase64 ?? storeObj.passport) {
//     body.append("passport", storeObj.passportBase64 ?? storeObj.passport)
//   }
//   console.log("Submission payload:", body);
//   return body
// }

// export const useRegistrationStore = create<
//   RegistrationData & {
//     updateField: (field: string, value: any) => void
//     nextStep: () => void
//     previousStep: () => void
//     markStepComplete: (step: number) => void
//     reset: () => void
//     loadFromApi: (data: any) => void
//     submitRegistration: (overridePayload?: Partial<RegistrationData>) => Promise<any>
//   }
// >(
//   persist(
//     (set) => ({
//       ...initialState,
//       // Populate store fields from backend API response shape
//       loadFromApi: (data: any) =>
//         set((state: any) => ({
//           // map known fields from backend response to store
//           businessActivity: data.lineOfBusiness ?? state.businessActivity,
//           commencementDate: data.businessCommencementDate ?? state.commencementDate,
//           businessAddress: data.companyAddress ?? state.businessAddress,
//           businessEmail: data.companyEmail ?? state.businessEmail,
//           businessPhone: data.proprietorPhonenumber ?? state.businessPhone,
//           selectedBusinessName: data.proposedOption1 ?? state.selectedBusinessName,
//           // proprietor -> applicant fields
//           firstName: data.proprietorFirstname ?? state.firstName,
//           middleName: data.proprietorOthername ?? state.middleName,
//           lastName: data.proprietorSurname ?? state.lastName,
//           dateOfBirth: data.proprietorDob ?? state.dateOfBirth,
//           gender: (data.proprietorGender ?? state.gender)?.toLowerCase() === "male" ? "male" : "female",
//           nationality: data.proprietorNationality ?? state.nationality,
//           phone: data.proprietorPhonenumber ?? state.phone,
//           email: data.proprietorEmail ?? state.email,
//           residentialAddress: `${data.proprietorStreetNumber ?? ""} ${data.proprietorServiceAddress ?? ""} ${data.proprietorCity ?? ""}`.trim(),
//           // transaction and document base64
//           applicationReference: data.transactionRef ?? state.applicationReference,
//           supportingDocBase64: data.supportingDoc ?? state.supportingDocBase64,
//           signatureBase64: data.signature ?? state.signatureBase64,
//           meansOfIdBase64: data.meansOfId ?? state.meansOfIdBase64,
//           passportBase64: data.passport ?? state.passportBase64,
//           submitted: false,
//         })),

//       // Submit registration payload to backend endpoint
//       submitRegistration: async (overridePayload?: Partial<RegistrationData>) => {
//         let result: any = null
//         try {
//           // If an override payload is provided, prefer it. Otherwise read persisted store from sessionStorage
//           let storeObj: any = overridePayload ? Object.fromEntries(Object.entries(overridePayload).filter(([key, value]) => typeof value !== 'function')) : {}

//           if (!overridePayload) {
//             const raw = localStorage.getItem("cbi-registration")
//             let parsed: any = {}
//             if (raw) {
//               try {
//                 parsed = JSON.parse(raw)
//               } catch (e) {
//                 parsed = {}
//               }
//             }
//             storeObj = parsed
//           }

//           const body = buildSubmissionPayload(storeObj)
//           console.log('storeObj:', storeObj)
//           console.log('body:', body)

//           const formData = new FormData()
//           for (const key in body) {
//             if (body[key] !== undefined) {
//               formData.append(key, body[key] ?? "")
//             }
//           }
//           console.log('formData entries:', [...formData.entries()])
//           console.log("Object.keys(body):",  Object.keys(body))
//           const resp = await fetch(`${API_BASE_URL}reg-bn`, {
//             method: "POST",
//             body: formData,
//           })

//           if (!resp.ok) throw new Error("Registration submission failed")

//           result = await resp.json()
//           // Optionally update store from response
//           set((s: any) => ({ applicationId: result?.data?.data?.rcNumber ?? s.applicationId }))
//         } catch (err) {
//           throw err
//         }

//         return result
//       },
//       updateField: (field: any, value: any) =>
//         set((state: any) => ({
//           ...state,
//           [field]: value,
//         })),
//       nextStep: () =>
//         set((state: any) => ({
//           currentStep: Math.min(state.currentStep + 1, 7),
//           completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
//         })),
//       previousStep: () =>
//         set((state: any) => ({
//           currentStep: Math.max(state.currentStep - 1, 1),
//         })),
//       markStepComplete: (step: number) =>
//         set((state: any) => ({
//           completedSteps: [...new Set([...state.completedSteps, step])],
//         })),
//       reset: () => set(initialState),
//     }),
//     {
//       name: "cbi-registration",
//     },
//   ) as any,
// )
