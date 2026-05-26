import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout/Layout"
import CartItemRow from "../components/Cart/CartItemRow";
import CartSummary from "../components/Cart/CartSummary";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const theme = useTheme()
  const navigate = useNavigate()

  const {
    items,
    pricing,
    loading,
    error,
    checkingOut,
    removeItem,
    updateQty,
    checkout,
  } = useCart()

  const handleCheckout = async () => {
    const orderId = await checkout()

    if (orderId) {
      navigate(`/orders/${orderId}`)
    }
  }

  const isEmpty = !loading && items.length === 0

  if (loading) {
    return (
      <Layout>
        <Box sx={{ px: 6, py: 6 }}>
          <CircularProgress />
          <Typography>Loading cart...</Typography>
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ px: 6, py: 6 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box sx={{ px: { xs: 3, md: 6 }, pt: 6, pb: 10, maxWidth: 900, mx: "auto" }}>
        {/* HEADER */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
            YOUR ORDER
          </Typography>

          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
            Review & <em style={{ color: theme.palette.primary.main }}>checkout</em>
          </Typography>
        </Box>

        {/* EMPTY */}
        {isEmpty ? (
          <Box
            sx={{
              textAlign: "center",
              p: 8,
              border: `0.5px solid ${theme.palette.divider}`,
              borderRadius: "8px",
            }}>
            <Typography>Your cart is empty</Typography>

            <Button onClick={() => navigate("/")}>
              Browse menu
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
              gap: 4,
            }}
          >
            {/* ITEMS */}
            <Box>
              {items.map((item, i) => (
                <CartItemRow
                  key={item._id}
                  item={item}
                  index={i}
                  onRemove={removeItem}
                  onUpdateQty={updateQty}
                />
              ))}
            </Box>

            {/* SUMMARY */}
            {pricing && (
              <CartSummary
                pricing={pricing}
                itemsCount={items.length}
                checkingOut={checkingOut}
                onCheckout={handleCheckout}
              />
            )}
          </Box>
        )}
      </Box>
    </Layout>
  )
}