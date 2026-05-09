import { describe, it, expect } from 'vitest'
import { isValidLuhn } from './luhn'

describe('isValidLuhn', () => {
  it('accepts the Visa test card (4242424242424242)', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true)
  })

  it('accepts the Visa test card with spaces', () => {
    expect(isValidLuhn('4242 4242 4242 4242')).toBe(true)
  })

  it('accepts the Mastercard test card (5555555555554444)', () => {
    expect(isValidLuhn('5555555555554444')).toBe(true)
  })

  it('rejects a number with a bad check digit', () => {
    expect(isValidLuhn('4242424242424243')).toBe(false)
  })

  it('rejects a uniformly repeated digit that fails the checksum', () => {
    expect(isValidLuhn('1111111111111111')).toBe(false)
  })

  it('rejects non-digit input', () => {
    expect(isValidLuhn('abcd')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidLuhn('')).toBe(false)
  })

  it('rejects a single digit', () => {
    expect(isValidLuhn('4')).toBe(false)
  })
})
