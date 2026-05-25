jest.setTimeout(20000)

// ============================================================
// El truco: mockear los modelos por su PATH EXACTO
// antes de que cualquier route los importe.
// Usamos jest.mock con factory que devuelve jest.fn() reales.
// ============================================================

// Chainable mock para queries que usan .sort().skip().limit()
const makeChainable = (resolvedValue: any) => {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(resolvedValue),
    exec: jest.fn().mockResolvedValue(resolvedValue),
    then: (resolve: any) => Promise.resolve(resolvedValue).then(resolve),
  }
  return chain
}

jest.mock("../src/models/Product", () => ({
  Product: {
    find: jest.fn().mockReturnValue(makeChainable([])),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock("../src/models/CartItem", () => ({
  CartItem: {
    find: jest.fn().mockReturnValue(makeChainable([])),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    findByIdAndDelete: jest.fn().mockResolvedValue(null),
  },
}))

jest.mock("../src/models/Order", () => ({
  Order: {
    find: jest.fn().mockReturnValue(makeChainable([])),
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    findByIdAndUpdate: jest.fn().mockResolvedValue(null),
  },
}))

jest.mock("../src/models/Idempotency", () => ({
  Idempotency: {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock("../src/models/TimelineEvent", () => ({
  TimelineEvent: {
    find: jest.fn().mockReturnValue(makeChainable([])),
    create: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock("../src/services/order-pricing.service", () => ({
  calculateOrderPricing: jest.fn(() => ({
    subtotalCents: 1000,
    taxCents: 100,
    serviceFeeCents: 50,
    totalCents: 1150,
  })),
}))

jest.mock("../src/services/timeline.service", () => ({
  createTimelineEvent: jest.fn().mockResolvedValue(undefined),
}))