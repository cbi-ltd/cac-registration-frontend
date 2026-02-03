"use client"

import React from "react"
import { useRegistrationStore, RegistrationData } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { Upload, File, X, CheckCircle2 } from "lucide-react"

/* ===================== TYPES ===================== */

interface DocumentInfo {
  name: string
  description: string
  fieldName: keyof RegistrationData
  required: boolean
  accepted: string[]
  maxSize: number
}

/* ===================== HELPERS ===================== */

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const formatAccepted = (types: string[]) =>
  types
    .map((t) => {
      if (t === "application/pdf") return "PDF"
      if (t === "image/jpeg") return "JPG"
      if (t === "image/png") return "PNG"
      return t
    })
    .join(", ")

/* ===================== COMPONENT ===================== */

export function DocumentUploadStep() {
  const store = useRegistrationStore()

  const [uploadErrors, setUploadErrors] = React.useState<Record<string, string>>(
    {}
  )

  const [fileMeta, setFileMeta] = React.useState<
    Record<string, { name: string; size: number }>
  >({})

  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

  /* ===================== DOCUMENT CONFIG ===================== */

  const documents: DocumentInfo[] = [
    {
      name: "Supporting Document",
      description: "Any supporting document (ID copy or company document).",
      fieldName: "supportingDocBase64",
      required: true,
      accepted: ["application/pdf", "image/jpeg", "image/png"],
      maxSize: 5 * 1024 * 1024,
    },
    {
      name: "Signature (scanned)",
      description: "Scanned signature image.",
      fieldName: "signatureBase64",
      required: true,
      accepted: ["image/jpeg", "image/png"],
      maxSize: 2 * 1024 * 1024,
    },
    {
      name: "Means of ID",
      description: "Photo or scan of the ID used.",
      fieldName: "meansOfIdBase64",
      required: true,
      accepted: ["application/pdf", "image/jpeg", "image/png"],
      maxSize: 5 * 1024 * 1024,
    },
    {
      name: "Passport Photo",
      description: "Recent passport-size photograph.",
      fieldName: "passportBase64",
      required: true,
      accepted: ["image/jpeg", "image/png"],
      maxSize: 1 * 1024 * 1024,
    },
  ]

  /* ===================== HANDLERS ===================== */

  const handleFileChange = (
    fieldName: keyof RegistrationData,
    file: File | null,
    doc: DocumentInfo
  ) => {
    if (!file) {
      store.updateField(fieldName, null)
      setFileMeta((prev) => {
        const copy = { ...prev }
        delete copy[fieldName as string]
        return copy
      })
      setUploadErrors((e) => ({ ...e, [fieldName]: "" }))
      return
    }

    if (!doc.accepted.includes(file.type)) {
      setUploadErrors((e) => ({
        ...e,
        [fieldName]: `Invalid file type. Accepted: ${formatAccepted(
          doc.accepted
        )}`,
      }))
      return
    }

    if (file.size > doc.maxSize) {
      setUploadErrors((e) => ({
        ...e,
        [fieldName]: `File size exceeds ${formatBytes(doc.maxSize)} limit`,
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      store.updateField(fieldName, reader.result as string)
      setFileMeta((prev) => ({
        ...prev,
        [fieldName]: { name: file.name, size: file.size },
      }))
      setUploadErrors((e) => ({ ...e, [fieldName]: "" }))
    }
    reader.onerror = () => {
      setUploadErrors((e) => ({
        ...e,
        [fieldName]: "Failed to read file",
      }))
    }
    reader.readAsDataURL(file)
  }

  const uploadedCount = documents.filter(
    (d) => !!(store as any)[d.fieldName]
  ).length

  /* ===================== RENDER ===================== */

  return (
    <div className="space-y-6 animate-slide-up">
      <FormSection
        title="Document Upload"
        description="Upload all required documents. Each document has its own size and format requirements."
        icon={<Upload className="w-5 h-5 text-primary" />}
        isRequired
      >
        {/* Progress */}
        <div className="mb-4 p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Documents Uploaded:{" "}
            <span className="font-semibold text-foreground">
              {uploadedCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {documents.length}
            </span>
          </p>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(uploadedCount / documents.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          {documents.map((doc) => {
            const value = (store as any)[doc.fieldName]
            const error = uploadErrors[doc.fieldName as string]

            return (
              <div
                key={doc.fieldName}
                className="p-4 rounded-lg border border-border"
              >
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  {doc.name}
                  {doc.required && (
                    <span className="text-destructive">*</span>
                  )}
                  {value && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {doc.description}
                </p>

                {value ? (
                  <div className="flex items-center justify-between p-3 mt-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {fileMeta[doc.fieldName as string]?.name} (
                        {formatBytes(
                          fileMeta[doc.fieldName as string]?.size || 0
                        )}
                        )
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleFileChange(doc.fieldName, null, doc)
                        fileInputRefs.current[doc.fieldName as string]!.value =
                          ""
                      }}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      fileInputRefs.current[doc.fieldName as string]?.click()
                    }
                    className="border-2 border-dashed border-border rounded-lg p-6 mt-3 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30"
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max {formatBytes(doc.maxSize)} •{" "}
                      {formatAccepted(doc.accepted)}
                    </p>
                  </div>
                )}

                <input
                  ref={(el) => {
                    if (el)
                      fileInputRefs.current[doc.fieldName as string] = el
                  }}
                  type="file"
                  accept={doc.accepted.join(",")}
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      doc.fieldName,
                      e.target.files?.[0] || null,
                      doc
                    )
                  }
                />

                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>
            )
          })}
        </div>
      </FormSection>
    </div>
  )
}




// "use client"

// import React from "react"
// import { useRegistrationStore,RegistrationData } from "@/lib/store"
// import { FormSection } from "@/components/form-section"
// import { Upload, File, X, CheckCircle2, Download } from "lucide-react"

// interface DocumentInfo {
//   name: string
//   description: string
//   fieldName: string
//   required: boolean
//   accepted: string[]
//   maxSize: number
//   alreadyUploaded?: boolean
// }

// export function DocumentUploadStep() {
//   const store = useRegistrationStore()
//   const [uploadErrors, setUploadErrors] = React.useState<Record<string, string>>({})
//   const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

//   const documents: DocumentInfo[] = [
//     {
//       name: "Supporting Document",
//       description: "Any supporting document (ID copy or company document).",
//       fieldName: "supportingDocBase64",
//       required: true,
//       accepted: ["application/pdf", "image/jpeg", "image/png"],
//       // accepted: ["image/jpeg", "image/png"],
//       maxSize: 5 * 1024 * 1024,
//     },
//     {
//       name: "Signature (scanned)",
//       description: "Scanned signature image",
//       fieldName: "signatureBase64",
//       required: true,
//       accepted: ["image/jpeg", "image/png"],
//       maxSize: 5 * 1024 * 1024,
//     },
//     {
//       name: "Means of ID (front)",
//       description: "Photo or scan of the ID used",
//       fieldName: "meansOfIdBase64",
//       required: true,
//       accepted: ["application/pdf", "image/jpeg", "image/png"],
//       maxSize: 5 * 1024 * 1024,
//     },
//     {
//       name: "Passport Photo",
//       description: "Recent passport-size photograph",
//       fieldName: "passportBase64",
//       required: true,
//       accepted: ["image/jpeg", "image/png"],
//       maxSize: 5 * 1024 * 1024,
//     },
//   ]

//   const handleFileChange = (fieldName: string, file: File | null, docInfo: DocumentInfo) => {
//     if (!file) {
//       store.updateField(fieldName as keyof RegistrationData, null)
//       setUploadErrors({ ...uploadErrors, [fieldName]: "" })
//       return
//     }

//     if (!docInfo.accepted.includes(file.type)) {
//       setUploadErrors({
//         ...uploadErrors,
//         [fieldName]: "Invalid file type. Accepted: PDF, JPG, PNG",
//       })
//       return
//     }

//     if (file.size > docInfo.maxSize) {
//       setUploadErrors({
//         ...uploadErrors,
//         [fieldName]: `File size exceeds ${docInfo.maxSize / (1024 * 1024)}MB limit`,
//       })
//       return
//     }

//     // convert to base64 and store into corresponding base64 field so payload can include it
//     const reader = new FileReader()
//     reader.onload = () => {
//       const result = reader.result as string
//       // store base64 string
//       store.updateField(fieldName as keyof RegistrationData, result)
//       setUploadErrors({ ...uploadErrors, [fieldName]: "" })
//     }
//     reader.onerror = () => {
//       setUploadErrors({ ...uploadErrors, [fieldName]: "Failed to read file" })
//     }
//     reader.readAsDataURL(file)
//   }

//   const uploadedCount = documents.filter((doc) => !!(store as any)[doc.fieldName]).length

//   return (
//     <div className="space-y-6 animate-slide-up">
//       <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

//       <FormSection
//         title="Document Upload"
//         description="Upload all required documents. Maximum file size: 5MB each. Accepted formats: PDF, JPG, PNG"
//         icon={<Upload className="w-5 h-5 text-primary" />}
//         isRequired
//       >
//         <div className="mb-4 p-4 rounded-lg bg-secondary/50 border border-border">
//           <p className="text-sm text-muted-foreground">
//             Documents Uploaded: <span className="font-semibold text-foreground">{uploadedCount}</span> of{" "}
//             <span className="font-semibold text-foreground">{documents.length}</span>
//           </p>
//           <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
//             <div
//               className="h-full bg-primary transition-all duration-300"
//               style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         <div className="space-y-4">
//           {documents.map((doc) => {
//             const fieldKey = doc.fieldName as keyof typeof store
//             const value = (store as any)[fieldKey] as string | null
//             const error = uploadErrors[doc.fieldName]

//             return (
//               <div key={doc.fieldName} className="p-4 rounded-lg border border-border">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex-1">
//                     <h3 className="font-medium text-foreground flex items-center gap-2">
//                       {doc.name}
//                       {doc.required && <span className="text-destructive">*</span>}
//                       {value && <CheckCircle2 className="w-4 h-4 text-green-600" />}
//                     </h3>
//                     <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
//                   </div>
//                 </div>

//                 {value ? (
//                   <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
//                     <div className="flex items-center gap-2">
//                       <File className="w-4 h-4 text-primary" />
//                       {/* <span className="text-sm text-foreground font-medium">Uploaded</span> */}
//                       <span className="text-sm text-foreground font-medium">{doc.name} {doc.maxSize /1024 }MB</span>
//                     </div>
//                     <button
//                       onClick={() => {
//                         handleFileChange(doc.fieldName, null, doc)
//                         if (fileInputRefs.current[doc.fieldName]) {
//                           fileInputRefs.current[doc.fieldName]!.value = ""
//                         }
//                       }}
//                       className="p-1 hover:bg-muted rounded transition-colors"
//                     >
//                       <X className="w-4 h-4 text-muted-foreground" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div
//                     onClick={() => fileInputRefs.current[doc.fieldName]?.click()}
//                     className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
//                   >
//                     <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                     <p className="text-sm font-medium text-foreground">Click to upload</p>
//                     <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
//                     <p className="text-xs text-muted-foreground mt-2">Max 1MB • JPG, PNG</p>
//                   </div>
//                 )}

//                 <input
//                   ref={(el) => {
//                     if (el) fileInputRefs.current[doc.fieldName] = el
//                   }}
//                   type="file"
//                   accept={doc.accepted.join(",")}
//                   onChange={(e) => handleFileChange(doc.fieldName, e.target.files?.[0] || null, doc)}
//                   className="hidden"
//                 />

//                 {error && <p className="text-sm text-destructive mt-2">{error}</p>}
//               </div>
//             )
//           })}
//         </div>

//       </FormSection>

//       <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
//     </div>
//   )
// }
