import { useState, useMemo } from "react"
import { meetsRequirements } from "../utils/modifiers"
import { calculateTotal } from "../utils/pricing";

export function useModifiers(product: any) {
  const [selected, setSelected] = useState<Record<string, any[]>>({})
  const [qty, setQty] = useState(1)

  const totalCents = useMemo(() => {
    if (!product) return 0
    return calculateTotal(product, selected, qty)
  }, [product, selected, qty])

  const valid = useMemo(() => {
    if (!product) return false
    return meetsRequirements(product, selected)
  }, [product, selected])

  return {
    selected,
    setSelected,
    qty,
    setQty,
    totalCents,
    valid,
  }
}