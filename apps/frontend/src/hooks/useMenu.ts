import { useEffect, useMemo, useState } from "react"
import { api } from "../services/api"
import type { Product } from "../types/product/product"

export function useMenu() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState("All")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await api.get("/menu")
        setProducts(res.data)
      } catch {
        setError("Failed to load menu")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const categories = useMemo(() => {
    const valid = products.map((p) => p.category).filter(Boolean)
    return ["All", ...Array.from(new Set(valid))]
  }, [products])

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products

    return products.filter(
      (p) =>
        p.category?.toLowerCase().trim() ===
        activeCategory.toLowerCase().trim()
    )
  }, [products, activeCategory])

  return {
    products,
    loading,
    error,

    activeCategory,
    setActiveCategory,

    categories,
    filtered,

    hoveredId,
    setHoveredId,
  }
}