import {
  Container,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"
import type { Order } from "../types/order/order"
import type { TimelineEvent } from "../types/timeline/timeline"
import Layout from "../components/Layout/Layout"
import OrderSummaryCard from "../components/OrderTrack/OrderSummaryCard"
import TimelineItem from "../components/OrderTrack/TimelineItem"

export default function OrderTrackPage() {
  const { orderId } = useParams()

  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const stopRef = useRef(false)

  const loadInitial = async () => {
    try {
      setError(null)
      const [orderRes, timelineRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get(`/orders/${orderId}/timeline`),
      ])
      setOrder(orderRes.data)
      setTimeline(timelineRes.data.events ?? [])
    } catch {
      setError("Failed to load order tracking")
    } finally {
      setInitialLoading(false)
    }
  }

  const refresh = async () => {
    try {
      const [orderRes, timelineRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get(`/orders/${orderId}/timeline`),
      ])
      setOrder(orderRes.data)
      setTimeline(timelineRes.data.events ?? [])
    } catch (err: any) {
      if (err?.response?.status === 404) {
        stopRef.current = true
        setError("Order not found")
      }
    }
  }

  useEffect(() => {
    if (!orderId) return
    stopRef.current = false
    loadInitial()
    const interval = setInterval(() => {
      if (stopRef.current) return
      void refresh()
    }, 4000)
    return () => {
      stopRef.current = true
      clearInterval(interval)
    }
  }, [orderId])

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  if (initialLoading) {
    return (
      <Layout>
        <Container sx={{ mt: 6, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Container sx={{ mt: 6 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <Container sx={{ mt: 6 }}>
          <Alert severity="warning">Order not found</Alert>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container sx={{ mt: 6, mb: 10, maxWidth: 800 }}>

        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="caption"
            sx={{ color: "primary.main", letterSpacing: "0.16em", display: "block", mb: 1 }}
          >
            ORDER TRACKING
          </Typography>
          <Typography variant="h4">
            Live{" "}
            <em style={{ color: "inherit" }}>updates</em>
          </Typography>
        </Box>

        {/* SUMMARY CARD */}
        <OrderSummaryCard order={order} orderId={orderId} />

        {/* TIMELINE */}
        <Typography
          variant="caption"
          sx={{ color: "primary.main", letterSpacing: "0.16em", display: "block", mb: 2 }}
        >
          ACTIVITY
        </Typography>

        {timeline.length === 0 ? (
          <Alert severity="info">Waiting for updates...</Alert>
        ) : (
          <Box>
            {timeline.map((event, i) => (
              <TimelineItem
                key={event.eventId}
                event={event}
                expanded={expanded[event.eventId] ?? false}
                onToggle={() => toggleExpand(event.eventId)}
                isLast={i === timeline.length - 1}
              />
            ))}
          </Box>
        )}

      </Container>
    </Layout>
  )
}