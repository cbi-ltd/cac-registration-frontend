"use client"

import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { FormSelect } from "@/components/form-select"
import { User } from "lucide-react"
import { countries } from "@/components/countries"

export function ApplicantInfoStep() {
  const store = useRegistrationStore()

  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ]
  const nationalities = countries

  const handleFieldChange = (field: string, value: string) => {
    store.updateField(field, value)
  }

  const showIdExpiryDate = !["NIN", "Voter's Card"].includes(store.idType)

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <FormSection
        title="Applicant Type"
        description="Are you registering as an individual or organization?"
        icon={<User className="w-5 h-5 text-primary" />}
        isRequired
      >
        <div className="flex gap-4">
          {["individual", "organization"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="applicantType"
                value={type}
                checked={store.applicantType === type}
                onChange={(e) => handleFieldChange("applicantType", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-foreground capitalize">{type}</span>
            </label>
          ))}
        </div>
      </FormSection>

      {/* Individual Fields (refactored to required keys only) */}
      {store.applicantType === "individual" && (
        <>
          <FormSection title="Personal Information" isRequired>
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                value={store.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                placeholder="Joshua"
                required
              />
              <FormInput
                label="Other/Middle Name"
                value={store.middleName}
                onChange={(e) => handleFieldChange("middleName", e.target.value)}
                placeholder="James"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Surname"
                value={store.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                placeholder="Adeyemo"
                required
              />
              <FormInput
                label="Date of Birth"
                type="date"
                value={store.dateOfBirth}
                onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                required
              />
            </div>
          </FormSection>

          <FormSection title="Contact & Address" isRequired>
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Phone Number"
                type="tel"
                value={store.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="07057001119"
                required
              />
              <FormInput
                label="Email Address"
                type="email"
                value={store.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="chylau12@gmail.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="Street Number"
                value={(store as any).proprietorStreetNumber || ""}
                onChange={(e) => handleFieldChange("proprietorStreetNumber", e.target.value)}
                placeholder="41"
              />
              <FormInput
                label="Street / Service Address"
                value={store.residentialAddress}
                onChange={(e) => handleFieldChange("residentialAddress", e.target.value)}
                placeholder="limpopo street"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="City"
                value={(store as any).proprietorCity || ""}
                onChange={(e) => handleFieldChange("proprietorCity", e.target.value)}
                placeholder="Abuja"
              />
              <FormInput
                label="State"
                value={(store as any).proprietorState || ""}
                onChange={(e) => handleFieldChange("proprietorState", e.target.value)}
                placeholder="F.C.T"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="Postcode"
                value={(store as any).proprietorPostcode || ""}
                onChange={(e) => handleFieldChange("proprietorPostcode", e.target.value)}
                placeholder="900108"
              />
              <FormInput
                label="LGA"
                value={(store as any).proprietorLga || ""}
                onChange={(e) => handleFieldChange("proprietorLga", e.target.value)}
                placeholder="lagos mainland"
              />
            </div>

            <div className="mt-4">
              <FormSelect
                label="Gender"
                value={store.gender?.toString().toUpperCase() ?? ""}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                options={genders}
              />
            </div>

            <div className="mt-4">
              <FormSelect
                label="Nationality"
                value={store.nationality}
                onChange={(e) => handleFieldChange("nationality", e.target.value)}
                options={nationalities.map((n) => ({ value: n, label: n }))}
              />
            </div>
          </FormSection>
        </>
      )}

      {/* Organization Fields */}
      {store.applicantType === "organization" && (
        <>
          <FormSection title="Organization Information" isRequired>
            <FormInput
              label="Organization Name"
              value={store.organizationName}
              onChange={(e) => handleFieldChange("organizationName", e.target.value)}
              placeholder="Organization name"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="RC Number"
                value={store.rcNumber}
                onChange={(e) => handleFieldChange("rcNumber", e.target.value)}
                placeholder="CAC RC number"
                required
              />
              <FormInput
                label="Organization Email"
                type="email"
                value={store.organizationEmail}
                onChange={(e) => handleFieldChange("organizationEmail", e.target.value)}
                placeholder="org@example.com"
                required
              />
            </div>
          </FormSection>

          <FormSection title="Contact Information" isRequired>
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Phone Number"
                type="tel"
                value={store.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="+234 800 000 0000"
                required
              />
              <FormSelect
                label="Gender (Signatory)"
                value={store.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                options={genders}
                required
              />
            </div>
          </FormSection>
        </>
      )}

      <FormSection title="Residential Address" isRequired>
        <FormInput
          label="Street Address"
          value={store.residentialAddress}
          onChange={(e) => handleFieldChange("residentialAddress", e.target.value)}
          placeholder="123 Main Street"
          required
        />
      </FormSection>

      {/* Identification moved to Document Upload step; minimal fields kept above */}

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
