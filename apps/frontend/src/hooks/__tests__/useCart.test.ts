// frontend/src/hooks/__tests__/useCart.test.ts

import { renderHook, act, waitFor } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import { useCart } from "../useCart"
import { api } from "../../services/api"

vi.mock("../../services/api", () => ({
  api: {
    get: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}))

// vi.mocked() infiere los tipos correctamente sin cast manual
const mockGet    = vi.mocked(api.get)
const mockDelete = vi.mocked(api.delete)
const mockPatch  = vi.mocked(api.patch)
const mockPost   = vi.mocked(api.post)

const mockCartResponse = {
  data: {
    items: [
      {
        _id: "item-1",
        productId: { name: "Burger" },
        productName: "Burger",
        quantity: 1,
        totalPriceCents: 1500,
        selectedModifiers: [],
      },
    ],
    pricing: {
      subtotalCents: 1500,
      taxCents: 120,
      serviceFeeCents: 75,
      totalCents: 1695,
    },
  },
}

describe("useCart", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockResolvedValue(mockCartResponse)
    mockDelete.mockResolvedValue({})
    mockPatch.mockResolvedValue({})
    mockPost.mockResolvedValue({ data: { orderId: "new-order-id" } })
  })

  it("loads cart on mount", async () => {
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.pricing?.totalCents).toBe(1695)
  })

  it("starts with loading = true", () => {
    mockGet.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useCart())
    expect(result.current.loading).toBe(true)
  })

  it("sets error state on load failure", async () => {
    mockGet.mockRejectedValue(new Error("Network error"))
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.items).toHaveLength(0)
  })

  it("removeItem calls DELETE and reloads cart", async () => {
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.removeItem("item-1")
    })

    expect(mockDelete).toHaveBeenCalledWith("/cart/items/item-1")
    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  it("updateQty calls PATCH and reloads cart", async () => {
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateQty("item-1", 3)
    })

    expect(mockPatch).toHaveBeenCalledWith("/cart/items/item-1", { quantity: 3 })
  })

  it("updateQty with qty < 1 calls removeItem instead", async () => {
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateQty("item-1", 0)
    })

    expect(mockDelete).toHaveBeenCalledWith("/cart/items/item-1")
    expect(mockPatch).not.toHaveBeenCalled()
  })

  it("checkout calls POST /orders with Idempotency-Key", async () => {
    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.checkout()
    })

    expect(mockPost).toHaveBeenCalledWith(
      "/orders",
      expect.objectContaining({ userId: "mock-user-1" }),
      expect.objectContaining({
        headers: expect.objectContaining({ "Idempotency-Key": expect.any(String) }),
      })
    )
  })

  it("checkout sets checkingOut = true during request", async () => {
    let resolveFn: (val: any) => void = () => {}
    mockPost.mockReturnValue(
      new Promise((resolve) => { resolveFn = resolve })
    )

    const { result } = renderHook(() => useCart())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => { result.current.checkout() })

    expect(result.current.checkingOut).toBe(true)

    act(() => { resolveFn({ data: { orderId: "x" } }) })
  })
})