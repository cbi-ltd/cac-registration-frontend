"use client"

import React from "react"
import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { Upload, File, X, CheckCircle2, Download } from "lucide-react"

interface DocumentInfo {
  name: string
  description: string
  fieldName: string
  required: boolean
  accepted: string[]
  maxSize: number
  alreadyUploaded?: boolean
}

export function DocumentUploadStep() {
  const store = useRegistrationStore()
  const [uploadErrors, setUploadErrors] = React.useState<Record<string, string>>({})
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

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
      description: "Scanned signature image",
      fieldName: "signatureBase64",
      required: true,
      accepted: ["image/jpeg", "image/png"],
      maxSize: 2 * 1024 * 1024,
    },
    {
      name: "Means of ID (front)",
      description: "Photo or scan of the ID used",
      fieldName: "meansOfIdBase64",
      required: true,
      accepted: ["application/pdf", "image/jpeg", "image/png"],
      maxSize: 5 * 1024 * 1024,
    },
    {
      name: "Passport Photo",
      description: "Recent passport-size photograph",
      fieldName: "passportBase64",
      required: true,
      accepted: ["image/jpeg", "image/png"],
      maxSize: 2 * 1024 * 1024,
    },
  ]

  const handleFileChange = (fieldName: string, file: File | null, docInfo: DocumentInfo) => {
    if (!file) {
      store.updateField(fieldName, null)
      setUploadErrors({ ...uploadErrors, [fieldName]: "" })
      return
    }

    if (!docInfo.accepted.includes(file.type)) {
      setUploadErrors({
        ...uploadErrors,
        [fieldName]: "Invalid file type. Accepted: PDF, JPG, PNG",
      })
      return
    }

    if (file.size > docInfo.maxSize) {
      setUploadErrors({
        ...uploadErrors,
        [fieldName]: `File size exceeds ${docInfo.maxSize / (1024 * 1024)}MB limit`,
      })
      return
    }

    // convert to base64 and store into corresponding base64 field so payload can include it
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // store base64 string
      store.updateField(fieldName, result)
      setUploadErrors({ ...uploadErrors, [fieldName]: "" })
    }
    reader.onerror = () => {
      setUploadErrors({ ...uploadErrors, [fieldName]: "Failed to read file" })
    }
    reader.readAsDataURL(file)
  }

  const downloadConsentLetter = () => {
    const consentTemplate = `CONSENT LETTER FOR CAC BUSINESS NAME REGISTRATION

Date: ${new Date().toLocaleDateString()}

TO: CORPORATE AFFAIRS COMMISSION (CAC)

RE: CONSENT TO BUSINESS NAME REGISTRATION

Dear Sir/Madam,

I, ___________________________________ (Full Name), hereby give my consent to the registration of the business name:

"${store.selectedBusinessName || "[Business Name]"}"

as a proprietorship/partnership in my name. I confirm that:

1. I am the authorized person to sign this document on behalf of the business
2. All information provided in the registration application is accurate and complete
3. I understand the implications of business name registration
4. I consent to the processing of my personal data as required by law
5. I acknowledge that this registration is with the Corporate Affairs Commission (CAC)

I further declare that the information contained in this application is true to the best of my knowledge and belief.

Signed:

__________________________                    Date: ________________
Signature of Applicant

Printed Name: ________________________

I.D. Type: ________________________    I.D. Number: ________________

Phone: ________________________        Email: ________________

Address: ________________________________________________________

Witnessed by:

__________________________                    Date: ________________
Witness Signature

Witness Name: ________________________

I.D. Type: ________________________    I.D. Number: ________________

NOTE: This letter must be signed in the presence of a witness.`

    const blob = new Blob([consentTemplate], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "CAC_Consent_Letter_Template.txt"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const uploadedCount = documents.filter((doc) => !!(store as any)[doc.fieldName]).length

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Document Upload"
        description="Upload all required documents. Maximum file size: 5MB each. Accepted formats: PDF, JPG, PNG"
        icon={<Upload className="w-5 h-5 text-primary" />}
        isRequired
      >
        <div className="mb-4 p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Documents Uploaded: <span className="font-semibold text-foreground">{uploadedCount}</span> of{" "}
            <span className="font-semibold text-foreground">{documents.length}</span>
          </p>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => {
            const fieldKey = doc.fieldName as keyof typeof store
            const value = (store as any)[fieldKey] as string | null
            const error = uploadErrors[doc.fieldName]

            return (
              <div key={doc.fieldName} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      {doc.name}
                      {doc.required && <span className="text-destructive">*</span>}
                      {value && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                  </div>
                </div>

                {value ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground font-medium">Uploaded</span>
                    </div>
                    <button
                      onClick={() => {
                        handleFileChange(doc.fieldName, null, doc)
                        if (fileInputRefs.current[doc.fieldName]) {
                          fileInputRefs.current[doc.fieldName]!.value = ""
                        }
                      }}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs.current[doc.fieldName]?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-2">Max 5MB • PDF, JPG, PNG</p>
                  </div>
                )}

                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current[doc.fieldName] = el
                  }}
                  type="file"
                  accept={doc.accepted.join(",")}
                  onChange={(e) => handleFileChange(doc.fieldName, e.target.files?.[0] || null, doc)}
                  className="hidden"
                />

                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
            )
          })}
        </div>

        {/* <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-amber-900 dark:text-amber-100">Need a consent letter template?</p>
            <button
              onClick={downloadConsentLetter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-medium hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div> */}
      </FormSection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
