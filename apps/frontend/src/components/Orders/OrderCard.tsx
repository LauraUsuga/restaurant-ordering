import { Card, CardContent, Typography, Box, Chip, Button } from "@mui/material"

interface Props {
  order: any
  onTrack: () => void
  getStatusColor: (status: string) => any
}

export default function OrderCard({
  order,
  onTrack,
  getStatusColor,
}: Props) {
  return (
    <Card sx={{ border: "1px solid rgba(255,255,255,0.1)" }}>

      <CardContent>

        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>

          {/* ORDER INFO */}
          <Box>
            <Typography sx={{ fontWeight: 600 }}>
              Order #{order._id.slice(-6)}
            </Typography>

            <Typography variant="caption">
              {new Date(order.createdAt ?? "").toLocaleString()}
            </Typography>
          </Box>

          {/* STATUS */}
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
          />

        </Box>

        {/* TOTAL */}
        <Typography sx={{ mb: 2 }}>
          Total ${(order.totalCents / 100).toFixed(2)}
        </Typography>

        {/* ACTION */}
        <Button variant="outlined" onClick={onTrack}>
          Track order
        </Button>

      </CardContent>
    </Card>
  )
}