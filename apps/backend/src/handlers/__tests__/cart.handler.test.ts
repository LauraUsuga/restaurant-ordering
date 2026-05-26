// Integration-style tests using mocked Mongoose models.
// Run with: npm test

import { addCartItem, updateCartItem, removeCartItem, getCart } from "../cart"

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../models/Product", () => ({
  Product: { findById: jest.fn() },
}))
jest.mock("../../models/CartItem", () => ({
  CartItem: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}))
jest.mock("../../services/timeline.service", () => ({
  createTimelineEvent: jest.fn().mockResolvedValue({}),
}))
jest.mock("../../services/pricing.service", () => ({
  calculateItemPrice: jest.fn().mockReturnValue(2500),
}))
jest.mock("../../services/order-pricing.service", () => ({
  calculateOrderPricing: jest.fn().mockReturnValue({
    subtotalCents: 2500,
    taxCents: 200,
    serviceFeeCents: 125,
    totalCents: 2825,
  }),
}))

import { Product } from "../../models/Product"
import { CartItem } from "../../models/CartItem"
import { createTimelineEvent } from "../../services/timeline.service"

const mockProduct = Product.findById as jest.Mock
const mockCartCreate = CartItem.create as jest.Mock
const mockCartFindById = CartItem.findById as jest.Mock
const mockCartDelete = CartItem.findByIdAndDelete as jest.Mock
const mockCartFind = CartItem.find as jest.Mock
const mockTimeline = createTimelineEvent as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

// ─── addCartItem ─────────────────────────────────────────────────────────────

describe("addCartItem", () => {
  const req: any = {
    body: {
      userId: "user-1",
      productId: "prod-1",
      quantity: 2,
      selectedModifiers: [],
      correlationId: "corr-1",
    },
  }

  it("returns 404 when product not found", async () => {
    mockProduct.mockResolvedValueOnce(null)
    const res = makeRes()
    await addCartItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: "Product not found" })
  })

  it("creates cart item and returns 201", async () => {
    const fakeProduct = { _id: "prod-1", name: "Burger", priceCents: 1200 }
    const fakeItem = {
      _id: "item-1",
      ...req.body,
      populate: jest.fn().mockResolvedValue({ _id: "item-1" }),
    }
    mockProduct.mockResolvedValueOnce(fakeProduct)
    mockCartCreate.mockResolvedValueOnce(fakeItem)

    const res = makeRes()
    await addCartItem(req, res)

    expect(mockCartCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        productId: "prod-1",
        productName: "Burger",
        totalPriceCents: 2500,
      })
    )
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("emits CART_ITEM_ADDED timeline event", async () => {
    const fakeProduct = { _id: "prod-1", name: "Burger", priceCents: 1200 }
    const fakeItem = {
      _id: "item-1",
      populate: jest.fn().mockResolvedValue({}),
    }
    mockProduct.mockResolvedValueOnce(fakeProduct)
    mockCartCreate.mockResolvedValueOnce(fakeItem)

    const res = makeRes()
    await addCartItem(req, res)

    expect(mockTimeline).toHaveBeenCalledWith(
      expect.objectContaining({ type: "CART_ITEM_ADDED" })
    )
  })
})

// ─── updateCartItem ───────────────────────────────────────────────────────────

describe("updateCartItem", () => {
  const req: any = {
    params: { id: "item-1" },
    body: { quantity: 3 },
    headers: { "x-correlation-id": "corr-99" },
  }

  it("returns 404 when item not found", async () => {
    mockCartFindById.mockResolvedValueOnce(null)
    const res = makeRes()
    await updateCartItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it("updates quantity and recalculates total", async () => {
    const fakeItem = {
      _id: "item-1",
      userId: "user-1",
      basePriceCents: 1200,
      quantity: 1,
      totalPriceCents: 1200,
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({ _id: "item-1" }),
    }
    mockCartFindById.mockResolvedValueOnce(fakeItem)

    const res = makeRes()
    await updateCartItem(req, res)

    expect(fakeItem.quantity).toBe(3)
    expect(fakeItem.totalPriceCents).toBe(3600) // 1200 * 3
    expect(fakeItem.save).toHaveBeenCalled()
  })

  it("emits CART_ITEM_UPDATED timeline event", async () => {
    const fakeItem = {
      _id: "item-1",
      userId: "user-1",
      basePriceCents: 1000,
      quantity: 1,
      totalPriceCents: 1000,
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({}),
    }
    mockCartFindById.mockResolvedValueOnce(fakeItem)

    const res = makeRes()
    await updateCartItem(req, res)

    expect(mockTimeline).toHaveBeenCalledWith(
      expect.objectContaining({ type: "CART_ITEM_UPDATED" })
    )
  })
})

// ─── removeCartItem ───────────────────────────────────────────────────────────

describe("removeCartItem", () => {
  const req: any = {
    params: { id: "item-1" },
    headers: { "x-correlation-id": "corr-del" },
  }

  it("returns 404 when item not found", async () => {
    mockCartDelete.mockResolvedValueOnce(null)
    const res = makeRes()
    await removeCartItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it("deletes item and returns 204", async () => {
    mockCartDelete.mockResolvedValueOnce({ _id: "item-1", userId: "user-1" })
    const res = makeRes()
    await removeCartItem(req, res)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalled()
  })

  it("emits CART_ITEM_REMOVED timeline event", async () => {
    mockCartDelete.mockResolvedValueOnce({ _id: "item-1", userId: "user-1" })
    const res = makeRes()
    await removeCartItem(req, res)
    expect(mockTimeline).toHaveBeenCalledWith(
      expect.objectContaining({ type: "CART_ITEM_REMOVED" })
    )
  })
})

// ─── getCart ──────────────────────────────────────────────────────────────────

describe("getCart", () => {
  const req: any = {
    params: { userId: "user-1" },
    headers: { "x-correlation-id": "corr-get" },
  }

  it("returns items and pricing", async () => {
    const fakeItems = [
      { _id: "i1", totalPriceCents: 1200 },
      { _id: "i2", totalPriceCents: 1300 },
    ]
    mockCartFind.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(fakeItems) })

    const res = makeRes()
    await getCart(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        items: fakeItems,
        pricing: expect.objectContaining({ totalCents: 2825 }),
      })
    )
  })

  it("emits PRICING_CALCULATED event", async () => {
    mockCartFind.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue([]) })
    const res = makeRes()
    await getCart(req, res)
    expect(mockTimeline).toHaveBeenCalledWith(
      expect.objectContaining({ type: "PRICING_CALCULATED" })
    )
  })
})