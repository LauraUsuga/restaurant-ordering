import {
  Container,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"
import type { Order } from "../types/order/order"
import type { TimelineEvent } from "../types/timeline/timeline"
import Layout from "../components/Layout/Layout"

import OrderHeader from "../components/OrderTrack/OrderHeader"
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
      if (!stopRef.current) refresh()
    }, 4000)

    return () => clearInterval(interval)
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
        <OrderHeader />

        {/* SUMMARY */}
        <OrderSummaryCard order={order} orderId={orderId} />

        {/* TIMELINE */}
        <Stack spacing={2}>
          {timeline.length === 0 && (
            <Alert severity="info">Waiting for updates...</Alert>
          )}

          {timeline.map((event) => (
            <TimelineItem
              key={event.eventId}
              event={event}
              expanded={expanded[event.eventId]}
              onToggle={() => toggleExpand(event.eventId)}
            />
          ))}
        </Stack>

      </Container>
    </Layout>
  )
}