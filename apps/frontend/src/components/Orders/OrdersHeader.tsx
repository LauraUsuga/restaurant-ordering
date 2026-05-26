import { Typography } from "@mui/material"

export default function OrdersHeader() {
  return (
    <>

      {/* TITLE */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        My orders
      </Typography>

      {/* SUBTITLE */}
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Review your order history and track live status
      </Typography>

    </>
  )
}