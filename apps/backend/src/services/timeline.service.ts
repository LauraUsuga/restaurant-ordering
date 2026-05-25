import { v4 as uuid } from "uuid"
import { TimelineEvent } from "../models/TimelineEvent"

type CreateEventInput = {
  orderId: string
  userId: string
  type: string
  source: "web" | "api" | "worker"
  correlationId: string
  payload: unknown
}

export const createTimelineEvent = async ({
  orderId,
  userId,
  type,
  source,
  correlationId,
  payload
}: CreateEventInput) => {
  const event = await TimelineEvent.create({
    eventId: uuid(),
    timestamp: new Date().toISOString(),
    orderId,
    userId,
    type,
    source,
    correlationId,
    payload
  })

  return event
}