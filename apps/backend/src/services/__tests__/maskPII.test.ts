import { maskPII } from "../maskPII"

describe("maskPII", () => {
  it("masks email field", () => {
    const result = maskPII({ email: "laura@example.com" })
    expect(result.email).not.toBe("laura@example.com")
    expect(result.email as string).toMatch(/\*/)
    // last 4 chars are preserved
    expect((result.email as string).slice(-4)).toBe(".com")
  })

  it("masks phone field", () => {
    const result = maskPII({ phone: "3165479810" })
    expect(result.phone as string).toMatch(/\*/)
    expect((result.phone as string).slice(-4)).toBe("9810")
  })

  it("masks phoneNumber field", () => {
    const result = maskPII({ phoneNumber: "3001234567" })
    expect(result.phoneNumber as string).toMatch(/\*/)
  })

  it("masks cel field", () => {
    const result = maskPII({ cel: "3001234567" })
    expect(result.cel as string).toMatch(/\*/)
  })

  it("does not mask non-PII fields", () => {
    const result = maskPII({ productId: "abc123", quantity: 2 })
    expect(result.productId).toBe("abc123")
    expect(result.quantity).toBe(2)
  })

  it("handles mixed payload — masks only PII keys", () => {
    const payload = {
      orderId: "order-1",
      email: "test@test.com",
      totalCents: 5000,
      phone: "1234567890",
    }
    const result = maskPII(payload)
    expect(result.orderId).toBe("order-1")
    expect(result.totalCents).toBe(5000)
    expect(result.email as string).toMatch(/\*/)
    expect(result.phone as string).toMatch(/\*/)
  })

  it("does not mutate the original object", () => {
    const original = { email: "user@example.com" }
    const result = maskPII(original)
    expect(original.email).toBe("user@example.com")
    expect(result.email).not.toBe("user@example.com")
  })

  it("handles empty payload", () => {
    expect(maskPII({})).toEqual({})
  })

  it("preserves non-string PII-keyed values unchanged", () => {
    // if someone stores a number under 'phone', don't break
    const result = maskPII({ phone: 1234567890 } as any)
    expect(result.phone).toBe(1234567890)
  })
})