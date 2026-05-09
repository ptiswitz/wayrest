export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  if (password.length < 8) errors.push('At least 8 characters required')
  if (!/[A-Z]/.test(password)) errors.push('At least 1 uppercase letter required')
  if (!/[0-9]/.test(password)) errors.push('At least 1 number required')
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('At least 1 special character required')
  return { valid: errors.length === 0, errors }
}
