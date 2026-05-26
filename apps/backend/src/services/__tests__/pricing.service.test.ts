import { calculateItemPrice } from "../pricing.service";
import { calculateOrderPricing } from "../order-pricing.service"

// ─── calculateItemPrice ───────────────────────────────────────────────────────

describe("calculateItemPrice", () => {
  const baseProduct = { priceCents: 1000 }

  it("returns base price when no modifiers", () => {
    expect(calculateItemPrice(baseProduct, 1, [])).toBe(1000)
  })

  it("multiplies by quantity", () => {
    expect(calculateItemPrice(baseProduct, 3, [])).toBe(3000)
  })

  it("adds modifier prices", () => {
    const mods = [{ priceCents: 200 }, { priceCents: 150 }]
    expect(calculateItemPrice(baseProduct, 1, mods)).toBe(1350)
  })

  it("multiplies (base + modifiers) by quantity", () => {
    const mods = [{ priceCents: 500 }]
    expect(calculateItemPrice(baseProduct, 2, mods)).toBe(3000)
  })

  it("handles modifier with priceCents = 0", () => {
    const mods = [{ priceCents: 0 }, { priceCents: 300 }]
    expect(calculateItemPrice(baseProduct, 1, mods)).toBe(1300)
  })

  it("handles modifier with undefined priceCents (fallback to 0)", () => {
    const mods = [{}]
    expect(calculateItemPrice(baseProduct, 1, mods as any)).toBe(1000)
  })

  it("returns 0 when product price is 0", () => {
    expect(calculateItemPrice({ priceCents: 0 }, 5, [])).toBe(0)
  })

  it("works with large quantities", () => {
    expect(calculateItemPrice(baseProduct, 100, [])).toBe(100000)
  })
})

// ─── calculateOrderPricing ───────────────────────────────────────────────────

describe("calculateOrderPricing", () => {
  beforeEach(() => {
    process.env.TAX_PERCENT = "8"
    process.env.SERVICE_FEE_PERCENT = "5"
  })

  afterEach(() => {
    delete process.env.TAX_PERCENT
    delete process.env.SERVICE_FEE_PERCENT
  })

  it("returns correct breakdown for a round subtotal", () => {
    const result = calculateOrderPricing(10000)
    expect(result.subtotalCents).toBe(10000)
    expect(result.taxCents).toBe(800)       // 8%
    expect(result.serviceFeeCents).toBe(500) // 5%
    expect(result.totalCents).toBe(11300)
  })

  it("uses default rates when env vars are missing", () => {
    delete process.env.TAX_PERCENT
    delete process.env.SERVICE_FEE_PERCENT
    const result = calculateOrderPricing(10000)
    expect(result.taxCents).toBe(1000)       // default 10%
    expect(result.serviceFeeCents).toBe(500) // default 5%
  })

  it("rounds fractional cents correctly", () => {
    // 1001 * 8% = 80.08 → rounds to 80
    const result = calculateOrderPricing(1001)
    expect(result.taxCents).toBe(80)
    expect(result.serviceFeeCents).toBe(50)
    expect(result.totalCents).toBe(1131)
  })

  it("handles zero subtotal", () => {
    const result = calculateOrderPricing(0)
    expect(result.subtotalCents).toBe(0)
    expect(result.taxCents).toBe(0)
    expect(result.serviceFeeCents).toBe(0)
    expect(result.totalCents).toBe(0)
  })

  it("all values are integers (no floats)", () => {
    const result = calculateOrderPricing(9999)
    expect(Number.isInteger(result.taxCents)).toBe(true)
    expect(Number.isInteger(result.serviceFeeCents)).toBe(true)
    expect(Number.isInteger(result.totalCents)).toBe(true)
  })

  it("total equals subtotal + tax + serviceFee", () => {
    const result = calculateOrderPricing(5750)
    expect(result.totalCents).toBe(
      result.subtotalCents + result.taxCents + result.serviceFeeCents
    )
  })
})