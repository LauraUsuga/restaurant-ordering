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

const STATUS_COLORS: Record<string, "warning" | "info" | "success" | "error" | "default"> = {
  PENDING: "warning",
  PREPARING: "info",
  ON_THE_WAY: "info",
  DELIVERED: "success",
  CANCELLED: "error",
}

export default function OrderSummaryCard({ order, orderId }: Props) {
  const theme = useTheme()

  const statusColor = STATUS_COLORS[order.status ?? ""] ?? "default"

  // Show friendly orderNumber if available, else truncate _id
  const displayId = order.orderNumber
    ?? (orderId ? `…${orderId.slice(-6)}` : "—")

  return (
    <Card sx={{ mb: 4, border: `0.5px solid ${theme.palette.divider}`, borderRadius: "4px" }}>
      <CardContent>

        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: "serif", fontStyle: "italic" }}>
            Order {displayId}
          </Typography>
          <Chip
            label={order.status}
            color={statusColor}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ITEMS LIST */}
        {order.items && order.items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "block",
                mb: 1,
              }}
            >
              Items
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {order.items.map((item: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    pb: 1.5,
                    borderBottom: i < order.items.length - 1
                      ? `0.5px solid ${theme.palette.divider}`
                      : "none",
                  }}
                >
                  {/* NAME + MODIFIERS */}
                  <Box>
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      {item.quantity}× {item.productName ?? item.productId}
                    </Typography>

                    {item.selectedModifiers?.length > 0 && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary, display: "block" }}
                      >
                        {item.selectedModifiers.map((m: any) => m.name).join(", ")}
                      </Typography>
                    )}
                  </Box>

                  {/* ITEM TOTAL */}
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: theme.palette.primary.main,
                      fontSize: "0.9rem",
                      flexShrink: 0,
                      ml: 2,
                    }}
                  >
                    ${(item.totalPriceCents / 100).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* PRICING BREAKDOWN */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 1.5 }}>
          {[
            { label: "Subtotal", val: order.subtotalCents },
            { label: "Tax", val: order.taxCents },
            { label: "Service fee", val: order.serviceFeeCents },
          ].map(({ label, val }) => (
            <Box key={label} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                ${((val ?? 0) / 100).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* TOTAL */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography sx={{ fontFamily: "serif" }}>Total</Typography>
          <Typography
            sx={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: "1.4rem",
              color: theme.palette.primary.main,
            }}
          >
            ${(order.totalCents / 100).toFixed(2)}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  )
}