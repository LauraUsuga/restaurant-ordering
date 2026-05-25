import { v4 as uuid } from "uuid"

export const createEvent = ({
  orderId,
  userId,
  type,
  source,
  correlationId,
  payload
}: any) => {
  return {
    eventId: uuid(),
    timestamp: new Date().toISOString(),
    orderId,
    userId,
    type,
    source,
    correlationId,
    payload
  }
}