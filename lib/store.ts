import { create } from "zustand"
import { persist,createJSONStorage, StateStorage } from "zustand/middleware"

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
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

/* ===================== STORE ===================== */

export const useRegistrationStore = create<
  RegistrationData & {
    hasHydrated: boolean
    updateField: (field: keyof RegistrationData, value: any) => void
    nextStep: () => void
    previousStep: () => void
    submitRegistration: () => Promise<any>
    reset: () => void
    setHasHydrated: (value: boolean) => void
  }
>()(
  persist(
    (set, get) => ({
      ...initialState,
      hasHydrated: false,

      updateField: (field, value) =>
      set({ [field]: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
          completedSteps: Array.from(
            new Set([...state.completedSteps, state.currentStep])
          ),
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
            if (errorData?.message) errorMessage = errorData.message
          } catch {}
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
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },

      // ✅ Persist ONLY serializable, long-lived data
      partialize: (state) => state,
      // partialize: (state) => ({
      //   currentStep: state.currentStep,
      //   completedSteps: state.completedSteps,
      //   selectedBusinessName: state.selectedBusinessName,
      //   applicantType: state.applicantType,
      //   applicationId: state.applicationId,
      //   applicationReference: state.applicationReference,
      //   firstName: state.firstName,
      //   middleName: state.middleName,
      //   lastName: state.lastName,
      //   organizationName: state.organizationName,
      //   rcNumber: state.rcNumber,
      //   organizationEmail: state.organizationEmail,
      //   dateOfBirth: state.dateOfBirth,
      //   lineOfBusiness: state.natureOfBusiness,
      //   commencementDate: state.commencementDate,
      //   gender: state.gender.toLocaleUpperCase(),
      //   streetNumber: state.companyStreetNumber,
      //   nationality: state.nationality,
      //   phone: state.phone,
      //   email: state.email,
      //   residentialAddress: state.residentialAddress,
      //   businessAddress: state.businessAddress,
      //   companyCity: state.companyCity,
      //   companyState: state.companyState,
      //   businessEmail: state.businessEmail,
      //   businessPhone: state.businessPhone,
      //   proprietorCity: state.proprietorCity,
      //   proprietorState: state.proprietorState,
      //   proprietorPostcode: state.proprietorPostcode,
      //   proprietorLga: state.proprietorLga,
      //   proprietorStreetNumber: state.proprietorStreetNumber,
      //   paymentStatus: state.paymentStatus,
      //   paymentReference: state.paymentReference,
      //   paymentError: state.paymentError,
      //   submitted: state.submitted,
      //   supportingDocBase64: state.supportingDocBase64,
      //   signatureBase64: state.signatureBase64,
      //   meansOfIdBase64: state.meansOfIdBase64,
      //   passportBase64: state.passportBase64,
      //   // add others that must survive refresh
      // }),
    }
  )
)


// export const useRegistrationStore = create<
//   RegistrationData & {
//     updateField: (field: keyof RegistrationData, value: any) => void
//     nextStep: () => void
//     previousStep: () => void
//     submitRegistration: () => Promise<any>
//     reset: () => void
//   }
// >()(
//   persist(
//     (set, get) => ({
//       ...initialState,

//       updateField: (field, value) =>
//         set((state) => ({ ...state, [field]: value })),

//       nextStep: () =>
//         set((state) => ({
//           currentStep: Math.min(state.currentStep + 1, 7),
//           completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
//         })),

//       previousStep: () =>
//         set((state) => ({
//           currentStep: Math.max(state.currentStep - 1, 1),
//         })),

//       submitRegistration: async () => {
//         const state = get()
//         const formData = buildSubmissionPayload(state)

//         const resp = await fetch(`${API_BASE_URL}reg-bn`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!resp.ok) {
//           let errorMessage = `${resp.status}: ${resp.statusText}`
//           try {
//             const errorData = await resp.json()
//             if (errorData.message) {
//               errorMessage = errorData.message
//             }
//           } catch (e) {
//             // If parsing JSON fails, use the default error message
//           }
//           throw new Error(errorMessage)
//         }

//         const result = await resp.json()

//         set({
//           applicationId: result?.data?.transactionRef,
//           applicationReference: result?.data?.transactionRef,
//         })

//         return result
//       },

//       reset: () => set(initialState),
//     }),
//     {
//       name: "cbi-registration",
//       storage: createJSONStorage(() =>
//         typeof window !== "undefined" ? localStorage : undefined
//       ),
//       // partialize: (state) => state, // persist full state safely
//     }
//   )
// )


