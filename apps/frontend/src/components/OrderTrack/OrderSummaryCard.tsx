import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
} from "@mui/material"
import type { Order } from "../../types/order/order"

interface Props {
  order: Order
  orderId?: string
}

export default function OrderSummaryCard({ order, orderId }: Props) {
  const theme = useTheme()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Card sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">
            Order #{orderId}
          </Typography>

          <Chip
            label={order.status}
            color={getStatusColor(order.status) as any}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
          Total: ${(order.totalCents / 100).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  )
}