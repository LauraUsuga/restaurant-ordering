import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"
import type { Order } from "../types/order"
import type { TimelineEvent } from "../types/timeline"

export default function OrderPage() {
  const { orderId } = useParams()

  const [order, setOrder] =
    useState<Order | null>(null)

  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([])

  const loadOrder = async () => {
    const res = await api.get(
      `/orders/${orderId}`
    )
    setOrder(res.data)
  }

  const loadTimeline = async () => {
    const res = await api.get(
      `/orders/${orderId}/timeline`
    )
    setTimeline(res.data)
  }

  useEffect(() => {
    if (!orderId) return

    loadOrder()
    loadTimeline()

    const interval = setInterval(() => {
      loadOrder()
      loadTimeline()
    }, 4000)

    return () => clearInterval(interval)
  }, [orderId])

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">
        Order Status
      </Typography>

      {order && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography>
              Status: {order.status}
            </Typography>

            <Typography>
              Total: $
              {(order.totalCents / 100).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Timeline
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {timeline.map((event) => (
          <Card key={event.eventId}>
            <CardContent>
              <Typography>
                {event.type}
              </Typography>

              <Typography variant="caption">
                {new Date(
                  event.timestamp
                ).toLocaleString()}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Source: {event.source}
              </Typography>

              <pre
                style={{
                  fontSize: 12,
                  marginTop: 10
                }}
              >
                {JSON.stringify(
                  event.payload,
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}