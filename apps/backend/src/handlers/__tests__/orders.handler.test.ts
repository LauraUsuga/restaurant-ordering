import { createOrder, getOrder } from "../orders"

jest.mock("../../models/CartItem", () => ({
  CartItem: {
    find: jest.fn(),
    deleteMany: jest.fn().mockResolvedValue({}),
  },
}))
jest.mock("../../models/Order", () => ({
  Order: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
}))
jest.mock("../../models/Idempotency", () => ({
  Idempotency: {
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue({}),
  },
}))
jest.mock("../../services/timeline.service", () => ({
  createTimelineEvent: jest.fn().mockResolvedValue({}),
}))
jest.mock("../../services/order-pricing.service", () => ({
  calculateOrderPricing: jest.fn().mockReturnValue({
    subtotalCents: 5000,
    taxCents: 400,
    serviceFeeCents: 250,
    totalCents: 5650,
  }),
}))

import { CartItem } from "../../models/CartItem"
import { Order } from "../../models/Order"
import { Idempotency } from "../../models/Idempotency"
import { createTimelineEvent } from "../../services/timeline.service"

const mockCartFind = CartItem.find as jest.Mock
const mockOrderCreate = Order.create as jest.Mock
const mockOrderFindById = Order.findById as jest.Mock
const mockIdempotencyFindOne = Idempotency.findOne as jest.Mock
const mockTimeline = createTimelineEvent as jest.Mock

const makeRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

// ─── createOrder ─────────────────────────────────────────────────────────────

describe("createOrder", () => {
  const req: any = {
    body: { userId: "user-1", correlationId: "corr-1" },
    headers: { "idempotency-key": "key-abc" },
  }

  beforeEach(() => {
    jest.useFakeTimers()

    mockTimeline.mockClear()
    mockOrderCreate.mockClear()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("returns 400 when cart is empty", async () => {
    mockIdempotencyFindOne.mockResolvedValueOnce(null)
    mockCartFind.mockResolvedValueOnce([])

    const res = makeRes()
    await createOrder(req, res)

    jest.runAllTimers()

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Cart is empty" })
  })

  it("returns existing orderId on duplicate idempotency key", async () => {
    mockIdempotencyFindOne.mockResolvedValueOnce({ orderId: "existing-order-id" })

    const res = makeRes()
    await createOrder(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.json).toHaveBeenCalledWith({ orderId: "existing-order-id" })
    expect(mockOrderCreate).not.toHaveBeenCalled()
  })

  it("creates order and returns 202 with orderId", async () => {
    mockIdempotencyFindOne.mockResolvedValueOnce(null)
    mockCartFind.mockResolvedValueOnce([
      { totalPriceCents: 2500, toObject: () => ({ totalPriceCents: 2500 }), productName: "Burger" },
      { totalPriceCents: 2500, toObject: () => ({ totalPriceCents: 2500 }), productName: "Fries" },
    ])
    mockOrderCreate.mockResolvedValueOnce({ _id: "new-order-id" })

    const res = makeRes()
    await createOrder(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.json).toHaveBeenCalledWith({ orderId: "new-order-id" })
  })

  it("emits ORDER_PLACED timeline event", async () => {
    mockIdempotencyFindOne.mockResolvedValueOnce(null)
    mockCartFind.mockResolvedValueOnce([
      { totalPriceCents: 5000, toObject: () => ({}), productName: "Steak" },
    ])
    mockOrderCreate.mockResolvedValueOnce({ _id: "order-99" })

    const res = makeRes()
    await createOrder(req, res)

    expect(mockTimeline).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ORDER_PLACED",
        orderId: "order-99",
        source: "web",
      })
    )
  })

  it("creates idempotency record after successful order", async () => {
    mockIdempotencyFindOne.mockResolvedValueOnce(null)
    mockCartFind.mockResolvedValueOnce([
      { totalPriceCents: 5000, toObject: () => ({}), productName: "Salmon" },
    ])
    mockOrderCreate.mockResolvedValueOnce({ _id: "order-88" })

    const res = makeRes()
    await createOrder(req, res)

    expect(Idempotency.create).toHaveBeenCalledWith({
      key: "key-abc",
      orderId: "order-88",
    })
  })
})

// ─── getOrder ─────────────────────────────────────────────────────────────────

describe("getOrder", () => {
  const req: any = { params: { orderId: "order-1" } }

  it("returns 404 when order not found", async () => {
    mockOrderFindById.mockResolvedValueOnce(null)
    const res = makeRes()
    await getOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: "Order not found" })
  })

  it("returns order data", async () => {
    const fakeOrder = { _id: "order-1", status: "PENDING", totalCents: 5650 }
    mockOrderFindById.mockResolvedValueOnce(fakeOrder)
    const res = makeRes()
    await getOrder(req, res)
    expect(res.json).toHaveBeenCalledWith(fakeOrder)
  })
})