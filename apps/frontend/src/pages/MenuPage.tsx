import {
  Box,
  Typography,
  useTheme,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useEffect, useState, useMemo } from "react"
import { api } from "../services/api"
import ModifierDrawer from "../components/ModifierDrawer"
import type { Product } from "../types/product/product"
import Layout from "../layouts/Layout"

interface MenuPageProps {
  onCartChange?: () => void
  cartCount?: number
}

export default function MenuPage({
  onCartChange,
  cartCount = 0,
}: MenuPageProps) {
  const theme = useTheme()

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
        setError(null)

        const res = await api.get("/menu")

        setProducts(res.data)
      } catch (err) {
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

  const handleAdd = async (
    product: Product,
    mods: any[],
    qty: number
  ) => {
    await api.post("/cart/items", {
      userId: "mock-user-1",
      productId: product._id,
      quantity: qty,
      selectedModifiers: mods,
      correlationId: crypto.randomUUID(),
    })

    setToast(`${product.name} added to cart`)
    onCartChange?.()
  }

  // normalización segura
  const normalize = (val?: string) =>
    val?.toLowerCase().trim()

  // categorías dinámicas desde backend
  const categories = useMemo(() => {
    const valid = products
      .map((p) => p.category)
      .filter(Boolean)

    return ["All", ...Array.from(new Set(valid))]
  }, [products])

  // filtro correcto
  const filtered =
    activeCategory === "All"
      ? products
      : products.filter(
        (p) =>
          normalize(p.category) ===
          normalize(activeCategory)
      )

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
  if (!products.length) {
    return (
      <Layout cartCount={cartCount}>
        <Box sx={{ px: 6, py: 6 }}>
          <Typography>No products available</Typography>
        </Box>
      </Layout>
    )
  }
  return (
    <Layout cartCount={cartCount}>
      <Box sx={{ px: { xs: 3, md: 6 }, pt: 6, pb: 10 }}>
        {/* HEADER */}
        <Box
          sx={{
            mb: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography variant="caption" sx={{
              color: theme.palette.primary.main,
              letterSpacing: "0.16em",
              display: "block",
              mb: 1.5,
            }}>
              SEASONAL MENU
            </Typography>

            <Typography variant="h2" sx={{
              fontSize: { xs: "2.2rem", md: "3rem" },
              lineHeight: 1.1,
            }}>
              What calls <br />
              <em style={{ color: theme.palette.primary.main }}>
                to you
              </em>{" "}
              today?
            </Typography>
          </Box>
        </Box>

        {/* CATEGORIES */}
        <Box sx={{ display: "flex", gap: 1, mb: 6, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <Box
              key={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                px: 2.5,
                py: 1,
                cursor: "pointer",
                border: `0.5px solid ${activeCategory === cat
                  ? theme.palette.primary.main
                  : "rgba(240,235,227,0.1)"
                  }`,
                background:
                  activeCategory === cat
                    ? "rgba(232,160,69,0.08)"
                    : "transparent",
                borderRadius: "2px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color:
                    activeCategory === cat
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {cat}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* GRID */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}>
          {filtered.map((product) => (
            <Box
              key={product._id}
              onMouseEnter={() => setHoveredId(product._id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => openCustomizer(product)}
              sx={{
                p: 3,
                border: `0.5px solid ${theme.palette.divider}`,
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  hoveredId === product._id
                    ? "rgba(232,160,69,0.03)"
                    : "transparent",
                display: "flex",
                flexDirection: "column",
                minHeight: 340,
              }}
            >
              {/* IMAGE (FIX + fallback) */}
              <Box
                sx={{
                  height: 140,
                  mb: 2,
                  overflow: "hidden",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.4,
                    fontSize: 12,
                  }}>
                    no image
                  </Box>
                )}
              </Box>

              {/* CATEGORY */}
              {product.category && (
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    mb: 1,
                    alignSelf: "flex-start",
                    background: "rgba(232,160,69,0.12)",
                    color: theme.palette.primary.main,
                    border: `0.5px solid rgba(232,160,69,0.3)`,
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                  }}
                />
              )}

              {/* NAME */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography variant="h5" sx={{ fontSize: "1.1rem", mb: 1 }}>
                  {product.name}
                </Typography>

                {product.modifierGroups && product.modifierGroups.length > 0 && (
                  <Chip
                    label="customize"
                    size="small"
                    sx={{
                      background: "rgba(232,160,69,0.08)",
                      color: theme.palette.primary.main,
                      border: `0.5px solid rgba(232,160,69,0.2)`,
                      fontSize: "0.6rem",
                    }}
                  />
                )}
              </Box>

              {/* DESCRIPTION */}
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                  fontSize: "0.8rem",
                }}
              >
                {product.description}
              </Typography>

              {/* PRICE */}
              <Box sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <Typography sx={{
                  fontSize: "1.3rem",
                  color: theme.palette.primary.main,
                  fontStyle: "italic",
                }}>
                  ${(product.priceCents / 100).toFixed(2)}
                </Typography>

                <Typography sx={{ opacity: 0.6 }}>+</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* DRAWER */}
      <ModifierDrawer
        open={drawerOpen}
        product={selectedProduct}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAdd}
      />

      {/* TOAST */}
      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">{toast}</Alert>
      </Snackbar>
    </Layout>
  )
}