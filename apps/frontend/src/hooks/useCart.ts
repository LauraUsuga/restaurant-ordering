import { useCallback, useEffect, useState } from "react"
import { api } from "../services/api"
import type { CartItem } from "../types/order/cart"
import type { Pricing } from "../types/order/pricing"

export function useCart(onCartChange?: () => void) {
  const [items, setItems] = useState<CartItem[]>([])
  const [pricing, setPricing] = useState<Pricing | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get("/cart/mock-user-1")

      setItems(res.data.items)
      setPricing(res.data.pricing)
    } catch {
      setError("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const removeItem = useCallback(
    async (id: string) => {
      await api.delete(`/cart/items/${id}`)
      await loadCart()
      onCartChange?.()
    },
    [loadCart, onCartChange]
  )

  const updateQty = useCallback(
    async (id: string, qty: number) => {
      if (qty < 1) return removeItem(id)

      await api.patch(`/cart/items/${id}`, { quantity: qty })
      await loadCart()
    },
    [loadCart, removeItem]
  )

  const checkout = useCallback(async () => {
    setCheckingOut(true)

    try {
      const res = await api.post(
        "/orders",
        {
          userId: "mock-user-1",
          correlationId: crypto.randomUUID(),
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        }
      )

      return res.data.orderId
    } finally {
      setCheckingOut(false)
    }
  }, [])

  return {
    items,
    pricing,
    loading,
    error,
    checkingOut,
    loadCart,
    removeItem,
    updateQty,
    checkout,
  }
}