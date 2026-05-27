import { useState, useEffect, useCallback } from "react"
import { api } from "../services/api"
import type { CartItem } from "../types/order/cart";
import type { Pricing } from "../types/order/pricing";

interface UseCartReturn {
  items: CartItem[]
  pricing: Pricing | null
  loading: boolean
  error: string | null
  checkingOut: boolean
  removeItem: (id: string) => Promise<void>
  updateQty: (id: string, qty: number) => Promise<void>
  checkout: () => Promise<string | null>
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([])
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  // ── Full reload from server (used only on mount and after remove) ──────────
  const loadCart = useCallback(async () => {
    try {
      setError(null)
      const res = await api.get("/cart/mock-user-1")
      setItems(res.data.items)
      setPricing(res.data.pricing)
    } catch {
      setError("Failed to load cart")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  // ── Optimistic qty update — no full reload, no flicker ────────────────────
  const updateQty = useCallback(async (id: string, qty: number) => {
    if (qty < 1) {
      return removeItem(id)
    }

    // Snapshot for rollback
    const prevItems = items
    const prevPricing = pricing

    // Optimistic update — recalculate totalPriceCents locally
    const updatedItems = items.map((item) => {
      if (item._id !== id) return item
      const modifierTotal = (item.selectedModifiers ?? []).reduce(
        (sum: number, m: any) => sum + (m.priceCents || 0), 0
      )
      const newTotal = (item.basePriceCents + modifierTotal) * qty
      return { ...item, quantity: qty, totalPriceCents: newTotal }
    })

    const newSubtotal = updatedItems.reduce((s, i) => s + i.totalPriceCents, 0)
    const taxRate = pricing ? pricing.taxCents / (pricing.subtotalCents || 1) : 0.08
    const feeRate = pricing ? pricing.serviceFeeCents / (pricing.subtotalCents || 1) : 0.05
    const newTax = Math.round(newSubtotal * taxRate)
    const newFee = Math.round(newSubtotal * feeRate)

    setItems(updatedItems)
    setPricing(pricing ? {
      subtotalCents: newSubtotal,
      taxCents: newTax,
      serviceFeeCents: newFee,
      totalCents: newSubtotal + newTax + newFee,
    } : null)

    // Sync with server in background
    try {
      await api.patch(`/cart/items/${id}`, { quantity: qty })
      // Refresh pricing from server (tax/fee are server-authoritative)
      const res = await api.get("/cart/mock-user-1")
      setItems(res.data.items)
      setPricing(res.data.pricing)
    } catch {
      // Rollback on failure
      setItems(prevItems)
      setPricing(prevPricing)
    }
  }, [items, pricing])

  // ── Remove item — full reload needed to get accurate server pricing ────────
  const removeItem = useCallback(async (id: string) => {
    // Optimistic remove
    const prevItems = items
    const prevPricing = pricing
    setItems((prev) => prev.filter((i) => i._id !== id))

    try {
      await api.delete(`/cart/items/${id}`)
      await loadCart()
    } catch {
      setItems(prevItems)
      setPricing(prevPricing)
    }
  }, [items, pricing, loadCart])

  // ── Checkout ──────────────────────────────────────────────────────────────
  const checkout = useCallback(async (): Promise<string | null> => {
    setCheckingOut(true)
    try {
      const res = await api.post(
        "/orders",
        { userId: "mock-user-1", correlationId: crypto.randomUUID() },
        { headers: { "Idempotency-Key": crypto.randomUUID() } }
      )
      return res.data.orderId as string
    } catch {
      return null
    } finally {
      setCheckingOut(false)
    }
  }, [])

  return { items, pricing, loading, error, checkingOut, removeItem, updateQty, checkout }
}