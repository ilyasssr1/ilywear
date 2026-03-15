/**
 * Form and data validation utilities
 */

export interface ValidationRule {
  required?: boolean | string;
  email?: boolean | string;
  minLength?: number | [number, string];
  maxLength?: number | [number, string];
  pattern?: RegExp | [RegExp, string];
  custom?: (value: any) => string | true;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate a single field
 */
export function validateField(
  value: any,
  rules: ValidationRule,
): string | null {
  // Required
  if (rules.required) {
    if (value === "" || value === null || value === undefined) {
      return typeof rules.required === "string"
        ? rules.required
        : "This field is required";
    }
  }

  // Email
  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return typeof rules.email === "string"
        ? rules.email
        : "Please enter a valid email";
    }
  }

  // Min length
  if (rules.minLength && value) {
    const [min, message] = Array.isArray(rules.minLength)
      ? rules.minLength
      : [rules.minLength, `Minimum length is ${rules.minLength}`];

    if (String(value).length < min) {
      return message;
    }
  }

  // Max length
  if (rules.maxLength && value) {
    const [max, message] = Array.isArray(rules.maxLength)
      ? rules.maxLength
      : [rules.maxLength, `Maximum length is ${rules.maxLength}`];

    if (String(value).length > max) {
      return message;
    }
  }

  // Pattern
  if (rules.pattern && value) {
    const [pattern, message] = Array.isArray(rules.pattern)
      ? rules.pattern
      : [rules.pattern, "Invalid format"];

    if (!pattern.test(String(value))) {
      return message;
    }
  }

  // Custom validation
  if (rules.custom && value) {
    const result = rules.custom(value);
    if (result !== true) {
      return result;
    }
  }

  return null;
}

/**
 * Validate multiple fields at once
 */
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field in schema) {
    const error = validateField(data[field], schema[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}

/**
 * Phone number validation
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+212|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  score: "weak" | "medium" | "strong";
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (password.length < 8) feedback.push("Use at least 8 characters");
  if (!/[A-Z]/.test(password)) feedback.push("Add uppercase letters");
  if (!/[0-9]/.test(password)) feedback.push("Add numbers");
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push("Add special characters");

  let strengthScore: "weak" | "medium" | "strong" = "weak";
  if (score >= 4) strengthScore = "medium";
  if (score >= 6) strengthScore = "strong";

  return { score: strengthScore, feedback };
}

/**
 * URL validation
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Date range validation
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate;
}
