import { Box, Typography, Button, Divider, useTheme } from "@mui/material"

interface Props {
  pricing: any
  itemsCount: number
  checkingOut: boolean
  onCheckout: () => void
}

export default function CartSummary({
  pricing,
  itemsCount,
  checkingOut,
  onCheckout,
}: Props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        border: `0.5px solid ${theme.palette.divider}`,
        p: 3,
        position: "sticky",
        top: 80,
      }}
    >

      {/* TITLE */}
      <Typography sx={{ mb: 2 }}>
        Order summary
      </Typography>

      {/* PRICING BREAKDOWN */}
      {[
        { label: "Subtotal", val: pricing.subtotalCents },
        { label: "Tax", val: pricing.taxCents },
        { label: "Service", val: pricing.serviceFeeCents },
      ].map((i) => (
        <Box
          key={i.label}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography>{i.label}</Typography>
          <Typography>
            ${(i.val / 100).toFixed(2)}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* TOTAL */}
      <Typography
        sx={{
          fontSize: "1.6rem",
          color: theme.palette.primary.main,
        }}
      >
        ${(pricing.totalCents / 100).toFixed(2)}
      </Typography>

      {/* CHECKOUT BUTTON */}
      <Button
        fullWidth
        variant="contained"
        disabled={!itemsCount || checkingOut}
        onClick={onCheckout}
      >
        {checkingOut ? "Placing order..." : "Place order"}
      </Button>

    </Box>
  )
}