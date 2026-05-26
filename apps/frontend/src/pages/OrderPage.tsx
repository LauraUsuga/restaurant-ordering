import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Box,
  Divider,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"
import type { Order } from "../types/order"
import type { TimelineEvent } from "../types/timeline"
import Layout from "./Layout";

export default function OrderPage() {
  const { orderId } = useParams()
  const theme = useTheme()

  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const loadOrder = async () => {
    const res = await api.get(`/orders/${orderId}`)
    setOrder(res.data)
  }

  const loadTimeline = async () => {
    const res = await api.get(`/orders/${orderId}/timeline`)
    setTimeline(res.data)
  }

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleString()

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
    <Layout>
      <Container sx={{ mt: 6, mb: 10, maxWidth: 800 }}>
        {/* HEADER */}
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Order tracking
        </Typography>

        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          Live updates of your order status
        </Typography>

        {/* ORDER CARD */}
        {order && (
          <Card
            sx={{
              mb: 4,
              border: `1px solid ${theme.palette.divider}`,
              background: "rgba(240,235,227,0.02)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
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
        )}

        {/* TIMELINE */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Activity
        </Typography>

        <Stack spacing={2}>
          {timeline.length === 0 && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Waiting for updates...
            </Typography>
          )}

          {timeline.map((event) => (
            <Card key={event.eventId} sx={{ border: `1px solid ${theme.palette.divider}`, background: "rgba(240,235,227,0.015)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, cursor: "pointer" }} onClick={() => toggleExpand(event.eventId)}>
                  <Typography sx={{ fontWeight: 500 }}>{event.type}</Typography>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>{formatDate(event.timestamp)}</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                      {expanded[event.eventId] ? "▲ collapse" : "▼ details"}
                    </Typography>
                  </Box>
                </Box>

                {expanded[event.eventId] && (
                  <>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 1 }}>
                      Source: {event.source} · correlationId: {event.correlationId}
                    </Typography>
                    {event.payload && (
                      <Box sx={{ mt: 1, p: 1.5, borderRadius: "4px", background: "rgba(0,0,0,0.2)", fontSize: 12, fontFamily: "monospace", overflowX: "auto", color: theme.palette.text.secondary }}>
                        {Object.entries(event.payload).map(([key, value]) => (
                          <Typography key={key} variant="caption" sx={{ display: "block" }}>
                            {key}: {String(value)}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Layout>
  )
}