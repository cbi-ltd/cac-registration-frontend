// Input validation and sanitization for security
import DOMPurify from "isomorphic-dompurify"

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Sanitize input against XSS attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return ""
  // Remove scripts and dangerous HTML
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
  // Remove extra whitespace
  return cleaned.trim()
}

// Validate business name
export const validateBusinessName = (name: string): ValidationResult => {
  const sanitized = sanitizeInput(name)
  const errors: string[] = []

  if (!sanitized) {
    errors.push("Business name is required")
    return { isValid: false, errors }
  }

  if (sanitized.length < 2 || sanitized.length > 50) {
    errors.push("Business name must be 2-50 characters")
  }

  // Check for SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i
  if (sqlInjectionPattern.test(sanitized)) {
    errors.push("Invalid characters in business name")
  }

  // Check for script tags or special characters
  if (/<script|<iframe|javascript:|onerror=/i.test(sanitized)) {
    errors.push("Invalid characters in business name")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate email
export const validateEmail = (email: string): ValidationResult => {
  const sanitized = sanitizeInput(email.toLowerCase())
  const errors: string[] = []

  if (!sanitized) {
    errors.push("Email is required")
    return { isValid: false, errors }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    errors.push("Invalid email format")
  }

  // Prevent homograph attacks
  if (/[а-яёА-ЯЁ]/.test(email)) {
    errors.push("Email contains invalid characters")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate Nigerian phone number
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const sanitized = sanitizeInput(phone.replace(/\s+/g, ""))
  const errors: string[] = []

  if (!sanitized) {
    errors.push("Phone number is required")
    return { isValid: false, errors }
  }

  // Nigerian phone format: +2348xxxxxxxx or 08xxxxxxxx
  const phoneRegex = /^(?:\+234|0)8\d{9}$/
  if (!phoneRegex.test(sanitized)) {
    errors.push("Invalid Nigerian phone number format")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate identification number (NIN format)
export const validateNIN = (nin: string): ValidationResult => {
  const sanitized = sanitizeInput(nin.replace(/\s+|-/g, ""))
  const errors: string[] = []

  if (!sanitized) {
    errors.push("NIN is required")
    return { isValid: false, errors }
  }

  if (!/^\d{11}$/.test(sanitized)) {
    errors.push("NIN must be 11 digits")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate international passport
export const validatePassport = (passport: string): ValidationResult => {
  const sanitized = sanitizeInput(passport.toUpperCase())
  const errors: string[] = []

  if (!sanitized) {
    errors.push("Passport number is required")
    return { isValid: false, errors }
  }

  if (!/^[A-Z]{1,2}\d{6,9}$/.test(sanitized)) {
    errors.push("Invalid passport format")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate date of birth (must be 18+)
export const validateDateOfBirth = (dob: string): ValidationResult => {
  const errors: string[] = []

  if (!dob) {
    errors.push("Date of birth is required")
    return { isValid: false, errors }
  }

  const birthDate = new Date(dob)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return { isValid: age > 18, errors: age < 18 ? ["Must be 18 years or older"] : [] }
  }

  if (age < 18) {
    errors.push("Must be 18 years or older")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate residential/business address
export const validateAddress = (address: string): ValidationResult => {
  const sanitized = sanitizeInput(address)
  const errors: string[] = []

  if (!sanitized) {
    errors.push("Address is required")
    return { isValid: false, errors }
  }

  if (sanitized.length < 10 || sanitized.length > 200) {
    errors.push("Address must be 10-200 characters")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate file upload
export const validateFileUpload = (file: File | null, maxSize = 5242880): ValidationResult => {
  const errors: string[] = []

  if (!file) {
    errors.push("File is required")
    return { isValid: false, errors }
  }

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
  if (!allowedTypes.includes(file.type)) {
    errors.push("Only PDF, JPG, PNG files are allowed")
  }

  if (file.size > maxSize) {
    errors.push(`File size must not exceed ${maxSize / 1024 / 1024}MB`)
  }

  return { isValid: errors.length === 0, errors }
}

// Generic required field validation
export const validateRequired = (value: any): ValidationResult => {
  const errors: string[] = []

  if (value === null || value === undefined || value === "") {
    errors.push("This field is required")
  }

  return { isValid: errors.length === 0, errors }
}

// Validate all applicant info at once
export const validateApplicantInfo = (data: any): ValidationResult => {
  const errors: string[] = []

  if (data.applicantType === "individual") {
    if (!data.title) errors.push("Title is required")
    if (!data.firstName) errors.push("First name is required")
    if (!data.lastName) errors.push("Last name is required")

    const dobValidation = validateDateOfBirth(data.dateOfBirth)
    if (!dobValidation.isValid) errors.push(...dobValidation.errors)
  } else if (data.applicantType === "organization") {
    if (!data.organizationName) errors.push("Organization name is required")
    if (!data.rcNumber) errors.push("RC number is required")
  }

  if (!data.gender) errors.push("Gender is required")

  const phoneValidation = validatePhoneNumber(data.phone)
  if (!phoneValidation.isValid) errors.push(...phoneValidation.errors)

  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) errors.push(...emailValidation.errors)

  const addressValidation = validateAddress(data.residentialAddress)
  if (!addressValidation.isValid) errors.push(...addressValidation.errors)

  return { isValid: errors.length === 0, errors }
}
