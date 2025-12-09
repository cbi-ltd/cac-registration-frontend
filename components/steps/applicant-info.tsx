"use client"

import { useRegistrationStore } from "@/lib/store"
import { FormSection } from "@/components/form-section"
import { FormInput } from "@/components/form-input"
import { FormSelect } from "@/components/form-select"
import { User } from "lucide-react"

export function ApplicantInfoStep() {
  const store = useRegistrationStore()

  const titles = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Engr", "Arc"]
  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]
  const nationalities = ["Nigerian", "Other"]
  const idTypes = ["NIN", "International Passport", "Driver's License", "Voter's Card"]

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

      {/* Individual Fields */}
      {store.applicantType === "individual" && (
        <>
          <FormSection title="Personal Information" isRequired>
            <div className="grid md:grid-cols-2 gap-4">
              <FormSelect
                label="Title"
                value={store.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                options={titles.map((t) => ({ value: t, label: t }))}
                required
              />
              <FormInput
                label="First Name"
                value={store.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                placeholder="John"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Middle Name"
                value={store.middleName}
                onChange={(e) => handleFieldChange("middleName", e.target.value)}
                placeholder="Michael"
              />
              <FormInput
                label="Last Name"
                value={store.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                placeholder="Smith"
                required
              />
            </div>
          </FormSection>

          <FormSection title="Contact & Demographics" isRequired>
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Date of Birth"
                type="date"
                value={store.dateOfBirth}
                onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                required
                tooltip="Must be 18 years or older"
              />
              <FormSelect
                label="Gender"
                value={store.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                options={genders}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormSelect
                label="Nationality"
                value={store.nationality}
                onChange={(e) => handleFieldChange("nationality", e.target.value)}
                options={nationalities.map((n) => ({ value: n, label: n }))}
                required
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={store.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="+234 800 000 0000"
                required
                tooltip="Valid Nigerian mobile number"
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              value={store.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
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

      <FormSection
        title="Identification"
        description="Provide your valid identification details. NIN and Voter's Card do not have expiry dates."
        isRequired
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormSelect
            label="Identification Type"
            value={store.idType}
            onChange={(e) => handleFieldChange("idType", e.target.value)}
            options={idTypes.map((t) => ({ value: t, label: t }))}
            required
          />
          <FormInput
            label="Identification Number"
            value={store.idNumber}
            onChange={(e) => handleFieldChange("idNumber", e.target.value)}
            placeholder="Enter your ID number"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Issue Date"
            type="date"
            value={store.idIssueDate}
            onChange={(e) => handleFieldChange("idIssueDate", e.target.value)}
            required
          />
          {showIdExpiryDate && (
            <FormInput
              label="Expiry Date"
              type="date"
              value={store.idExpiryDate}
              onChange={(e) => handleFieldChange("idExpiryDate", e.target.value)}
              required
            />
          )}
        </div>
      </FormSection>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
