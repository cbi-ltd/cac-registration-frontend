"use client"

import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { FormSelect } from "@/components/form-select"
import { Briefcase } from "lucide-react"

export function BusinessDetailsStep() {
  const store = useRegistrationStore()

  const businessActivities = [
    { value: "trading", label: "Trading/Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "services", label: "Services" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "technology", label: "Information Technology" },
    { value: "agriculture", label: "Agriculture" },
    { value: "construction", label: "Construction" },
    { value: "other", label: "Other" },
  ]

  const natureOfBusiness = ["Trading", "Manufacturing", "Services", "Hybrid"]

  const handleFieldChange = (field: string, value: any) => {
    store.updateField(field, value)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <FormSection title="Selected Business Name" icon={<Briefcase className="w-5 h-5 text-primary" />}>
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-sm text-muted-foreground">Business Name</p>
          <p className="text-lg font-semibold text-foreground mt-1">{store.selectedBusinessName}</p>
        </div>
      </FormSection>

      <FormSection title="Business Classification" isRequired>
        <div className="grid md:grid-cols-2 gap-4">
          <FormSelect
            label="Business Activity"
            value={store.businessActivity}
            onChange={(e) => handleFieldChange("businessActivity", e.target.value)}
            options={businessActivities}
            required
            tooltip="Select the primary activity of your business"
          />
          <FormSelect
            label="Nature of Business"
            value={store.natureOfBusiness}
            onChange={(e) => handleFieldChange("natureOfBusiness", e.target.value)}
            options={natureOfBusiness.map((n) => ({ value: n, label: n }))}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Business Address" isRequired>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={store.sameAsResidential}
              onChange={(e) => handleFieldChange("sameAsResidential", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-foreground">Same as residential address</span>
          </label>
        </div>

        {!store.sameAsResidential && (
          <FormInput
            label="Business Street Address"
            value={store.businessAddress}
            onChange={(e) => handleFieldChange("businessAddress", e.target.value)}
            placeholder="123 Business Street"
            required
          />
        )}
      </FormSection>

      <FormSection title="Business Contact Information" isRequired>
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Business Phone Number"
            type="tel"
            value={store.businessPhone}
            onChange={(e) => handleFieldChange("businessPhone", e.target.value)}
            placeholder="+234 800 000 0000"
            required
          />
          <FormInput
            label="Business Email"
            type="email"
            value={store.businessEmail}
            onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
            placeholder="business@example.com"
            required
          />
        </div>
      </FormSection>

      <FormSection title="Business Commencement Date" isRequired>
        <FormInput
          label="Proposed Commencement Date"
          type="date"
          value={store.commencementDate}
          onChange={(e) => handleFieldChange("commencementDate", e.target.value)}
          required
          tooltip="The date you plan to officially start business operations"
        />
      </FormSection>
    </div>
  )
}
