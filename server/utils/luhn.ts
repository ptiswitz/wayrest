export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '')
  if (!/^\d+$/.test(digits) || digits.length < 2) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10)
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}
