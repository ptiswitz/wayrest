import { describe, it, expect } from 'vitest'
import { validatePassword } from './validatePassword'

describe('validatePassword', () => {
  it('accepts a valid password', () => {
    expect(validatePassword('Secure1!')).toEqual({ valid: true, errors: [] })
  })

  it('rejects missing uppercase', () => {
    const result = validatePassword('secure1!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least 1 uppercase letter required')
  })

  it('rejects missing number', () => {
    const result = validatePassword('Secured!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least 1 number required')
  })

  it('rejects missing special char', () => {
    const result = validatePassword('Secured1')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least 1 special character required')
  })

  it('rejects under 8 chars', () => {
    const result = validatePassword('S1!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least 8 characters required')
  })
})
