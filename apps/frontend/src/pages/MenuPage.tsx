import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useEffect, useState, useMemo } from "react"
import { api } from "../services/api"
import ModifierDrawer from "../components/ModifierDrawer/ModifierDrawer"
import type { Product } from "../types/product/product"
import Layout from "../components/Layout/Layout"

import MenuPageHeader from "../components/Menu/MenuPageHeader"
import CategoryFilter from "../components/Menu/CategoryFilter"
import ProductCard from "../components/Menu/ProductCard"

export default function MenuPage({ cartCount = 0 }: any) {

  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState("All")

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [toast, setToast] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
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

  const openCustomizer = (product: Product) => {
    setSelectedProduct(product)
    setDrawerOpen(true)
  }

  const handleAdd = async (product: Product, mods: any[], qty: number) => {
    await api.post("/cart/items", {
      userId: "mock-user-1",
      productId: product._id,
      quantity: qty,
      selectedModifiers: mods,
      correlationId: crypto.randomUUID(),
    })

    setToast(`${product.name} added to cart`)
  }

  const categories = useMemo(() => {
    const valid = products.map((p) => p.category).filter(Boolean)
    return ["All", ...Array.from(new Set(valid))]
  }, [products])

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory)

  if (loading) {
    return (
      <Layout cartCount={cartCount}>
        <Box sx={{ px: 6, py: 6 }}>
          <CircularProgress />
          <Typography>Loading menu...</Typography>
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout cartCount={cartCount}>
        <Box sx={{ px: 6, py: 6 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout cartCount={cartCount}>
      <Box sx={{ px: { xs: 3, md: 6 }, pt: 6, pb: 10 }}>

        <MenuPageHeader />

        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* GRID (NO TOCAR ESTILOS) */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}>
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onClick={() => openCustomizer(product)}
            />
          ))}
        </Box>
      </Box>

      <ModifierDrawer
        open={drawerOpen}
        product={selectedProduct}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAdd}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast("")}
      >
        <Alert severity="success">{toast}</Alert>
      </Snackbar>
    </Layout>
  )
}