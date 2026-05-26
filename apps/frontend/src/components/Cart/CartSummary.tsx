import { Box, Typography, Button, Divider, useTheme } from "@mui/material"

export default function CartSummary({
  pricing,
  itemsCount,
  checkingOut,
  onCheckout,
}: any) {
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
      <Typography sx={{ mb: 2 }}>Order summary</Typography>

      {[
        { label: "Subtotal", val: pricing.subtotalCents },
        { label: "Tax", val: pricing.taxCents },
        { label: "Service", val: pricing.serviceFeeCents },
      ].map((i) => (
        <Box key={i.label} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>{i.label}</Typography>
          <Typography>${(i.val / 100).toFixed(2)}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ fontSize: "1.6rem", color: theme.palette.primary.main }}>
        ${(pricing.totalCents / 100).toFixed(2)}
      </Typography>

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