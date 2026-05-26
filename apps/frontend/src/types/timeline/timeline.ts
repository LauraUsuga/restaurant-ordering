export type TimelineEvent = {
  eventId: string
  timestamp: string
  orderId: string
  userId: string
  type: string
  source: "web" | "api" | "worker"
  correlationId: string
  payload: Record<string, unknown>
}