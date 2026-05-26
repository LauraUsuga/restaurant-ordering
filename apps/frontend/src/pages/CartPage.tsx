import {
  Box,
  Typography,
  Button,
  useTheme,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { useEffect, useState } from "react"
import { api } from "../services/api"
import { useNavigate } from "react-router-dom"
import Layout from "../layouts/Layout";
import type { CartItem } from "../types/order/cart";
import type { Pricing } from "../types/order/pricing";

interface CartPageProps {
  onCartChange?: () => void
  cartCount?: number
}

export default function CartPage({ onCartChange, cartCount = 0 }: CartPageProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCart = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get("/cart/mock-user-1")

      setItems(res.data.items)
      setPricing(res.data.pricing)
    } catch (err) {
      setError("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const removeItem = async (id: string) => {
    await api.delete(`/cart/items/${id}`)
    await loadCart()
    onCartChange?.()
  }

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return removeItem(id)
    await api.patch(`/cart/items/${id}`, { quantity: qty })
    await loadCart()
  }

  const checkout = async () => {
    setCheckingOut(true)
    try {
      const res = await api.post(
        "/orders",
        { userId: "mock-user-1", correlationId: crypto.randomUUID() },
        { headers: { "Idempotency-Key": crypto.randomUUID() } }
      )
      navigate(`/orders/${res.data.orderId}`)
    } finally {
      setCheckingOut(false)
    }
  }

  const isEmpty = !loading && items.length === 0

  if (loading) {
    return (
      <Layout cartCount={cartCount}>
        <Box sx={{ px: 6, py: 6 }}>
          <CircularProgress />
          <Typography>Loading cart...</Typography>
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
      <Box sx={{ px: { xs: 3, md: 6 }, pt: 6, pb: 10, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="caption" sx={{ color: theme.palette.primary.main, letterSpacing: "0.16em", display: "block", mb: 1.5 }}>
            YOUR ORDER
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
            Review &{" "}
            <em style={{ color: theme.palette.primary.main }}>checkout</em>
          </Typography>
        </Box>

        {isEmpty ? (
          <Box
            sx={{
              border: `0.5px solid ${theme.palette.divider}`,
              p: 8,
              textAlign: "center",
              borderRadius: "2px",
            }}
          >
            <Typography variant="h5" sx={{ mb: 1.5, color: theme.palette.text.secondary, fontSize: "1.2rem" }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 4 }}>
              Head back to the menu and find something you love
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
              Browse menu
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" }, gap: 4, alignItems: "start" }}>
            <Box>
              {items.map((item, i) => {
                const productName =
                  typeof item.productId === "object"
                    ? item.productId.name
                    : "Unknown product"

                return (
                  <Box
                    key={item._id}
                    sx={{
                      p: 3,
                      border: `0.5px solid ${theme.palette.divider}`,
                      borderBottom: i < items.length - 1 ? "none" : `0.5px solid ${theme.palette.divider}`,
                      display: "flex",
                      gap: 3,
                      alignItems: "flex-start",
                      transition: "background 0.15s",
                      "&:hover": { background: "rgba(240,235,227,0.02)" },
                      animation: `slideIn 0.3s ease both`,
                      animationDelay: `${i * 0.06}s`,
                      "@keyframes slideIn": {
                        from: { opacity: 0, transform: "translateX(-8px)" },
                        to: { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          mb: 0.5,
                        }}
                      >
                        {productName}
                      </Typography>
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", mb: 1 }}>
                          {item.selectedModifiers.map((m) => m.name).join(", ")}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item._id, item.quantity - 1)}
                          sx={{
                            width: 24,
                            height: 24,
                            border: `0.5px solid ${theme.palette.divider}`,
                            borderRadius: "2px",
                            color: theme.palette.text.secondary,
                            fontSize: 14,
                          }}
                        >
                          <span style={{ lineHeight: 1 }}>−</span>
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 20, textAlign: "center" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item._id, item.quantity + 1)}
                          sx={{
                            width: 24,
                            height: 24,
                            border: `0.5px solid ${theme.palette.divider}`,
                            borderRadius: "2px",
                            color: theme.palette.text.secondary,
                            fontSize: 14,
                          }}
                        >
                          <span style={{ lineHeight: 1 }}>+</span>
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                      <Typography
                        sx={{
                          fontStyle: "italic",
                          color: theme.palette.primary.main,
                          fontSize: "1.1rem",
                        }}
                      >
                        ${(item.totalPriceCents / 100).toFixed(2)}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => removeItem(item._id)}
                        sx={{
                          color: theme.palette.text.disabled,
                          fontSize: "0.65rem",
                          letterSpacing: "0.08em",
                          p: 0,
                          minWidth: 0,
                          "&:hover": { color: "#C0392B", background: "transparent" },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )
              })}
            </Box>

            {pricing && (
              <Box
                sx={{
                  border: `0.5px solid ${theme.palette.divider}`,
                  p: 3,
                  position: "sticky",
                  top: 80,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2.5, color: theme.palette.text.secondary }}>
                  Order summary
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                  {[
                    { label: "Subtotal", val: pricing.subtotalCents },
                    { label: "Tax (8%)", val: pricing.taxCents },
                    { label: "Service (5%)", val: pricing.serviceFeeCents },
                  ].map(({ label, val }) => (
                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        ${(val / 100).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 3 }}>
                  <Typography sx={{ fontSize: "1.1rem" }}>
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.6rem",
                      fontStyle: "italic",
                      color: theme.palette.primary.main,
                    }}
                  >
                    ${(pricing.totalCents / 100).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!items.length || checkingOut}
                  onClick={checkout}
                  sx={{ py: 1.5 }}
                >
                  {checkingOut ? "Placing order..." : "Place order"}
                </Button>

                <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: "block", mt: 1.5, textAlign: "center" }}>
                  Pricing calculated server-side
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  )
}