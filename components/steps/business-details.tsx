"use client"

import { RegistrationData, useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { FormSelect } from "@/components/form-select"
import { Briefcase } from "lucide-react"

export function BusinessDetailsStep() {
  const store = useRegistrationStore()

  // Simplified: map user-entered lineOfBusiness and company address fields

  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
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
          <FormInput
            label="Line of Business"
            value={store.businessActivity}
            onChange={(e) => handleFieldChange("businessActivity", e.target.value)}
            placeholder="fashion"
            required
          />
          <FormInput
            label="Proposed Business Name"
            value={store.selectedBusinessName}
            onChange={(e) => handleFieldChange("selectedBusinessName", e.target.value)}
            placeholder="joshua ahmed store"
            required
          />
        </div>
      </FormSection>

      <FormSection title="Business Address" isRequired>
        {/* <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={store.sameAsResidential}
              onChange={(e) => handleFieldChange("sameAsResidential", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-foreground">Same as residential address</span>
          </label>
        </div> */}

        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Business Street Number"
            value={store.companyStreetNumber}
            onChange={(e) => handleFieldChange("companyStreetNumber", e.target.value)}
            placeholder="41"
          />
          <FormInput
            label="Business Street / Address"
            value={store.businessAddress}
            onChange={(e) => handleFieldChange("businessAddress", e.target.value)}
            placeholder="limpopo street"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <FormInput
            label="City"
            value={store.companyCity}
            onChange={(e) => handleFieldChange("companyCity", e.target.value)}
            placeholder="Abuja"
          />
          <FormInput
            label="State"
            value={store.companyState}
            onChange={(e) => handleFieldChange("companyState", e.target.value)}
            placeholder="F.C.T"
          />
        </div>
      </FormSection>

      <FormSection title="Business Contact Information" isRequired>
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Business Phone Number"
            type="tel"
            value={store.businessPhone}
            onChange={(e) => handleFieldChange("businessPhone", e.target.value)}
            placeholder="07057001119"
            required
          />
          <FormInput
            label="Business Email"
            type="email"
            value={store.businessEmail}
            onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
            placeholder="chylau12@gmail.com"
            required
          />
        </div>
      </FormSection>

      <FormSection title="Business Commencement Date" isRequired>
        <FormInput
          label="Business Commencement Date"
          type="date"
          value={store.commencementDate}
          onChange={(e) => handleFieldChange("commencementDate", e.target.value)}
          required
        />
      </FormSection>
    </div>
  )
}
