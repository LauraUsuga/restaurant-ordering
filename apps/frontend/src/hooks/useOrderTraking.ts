import { useEffect, useRef, useState } from "react"
import { api } from "../services/api"
import type { Order } from "../types/order/order"
import type { TimelineEvent } from "../types/timeline/timeline"

export function useOrderTracking(orderId?: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stopRef = useRef(false)

  const load = async () => {
    try {
      setError(null)

      const [orderRes, timelineRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get(`/orders/${orderId}/timeline`)
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
        api.get(`/orders/${orderId}/timeline`)
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
    setInitialLoading(true)

    load()

    const interval = setInterval(() => {
      if (!stopRef.current) refresh()
    }, 4000)

    return () => clearInterval(interval)
  }, [orderId])

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleString()

  return {
    order,
    timeline,
    expanded,
    initialLoading,
    error,
    toggleExpand,
    getStatusColor,
    formatDate,
  }
}