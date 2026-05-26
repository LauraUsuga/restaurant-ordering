import { v4 as uuid } from "uuid"
import { TimelineEvent } from "../models/TimelineEvent"
import { maskPII } from "./maskPII"

type CreateEventInput = {
  orderId: string
  userId: string
  type: string
  source: "web" | "api" | "worker"
  correlationId: string
  payload: Record<string, unknown>
}

export const createTimelineEvent = async ({
  orderId,
  userId,
  type,
  source,
  correlationId,
  payload
}: CreateEventInput) => {
  const safePayload = maskPII(payload)

  console.log("[timeline]", {
    type,
    orderId,
    payload: safePayload
  })

  return TimelineEvent.create({
    eventId: uuid(),
    timestamp: new Date().toISOString(),
    orderId,
    userId,
    type,
    source,
    correlationId,
    payload
  })
}