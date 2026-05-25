import request from "supertest"
import app from "../src/app"
import { TimelineEvent } from "../src/models/TimelineEvent"

describe("Timeline API", () => {
  it("should return timeline events array", async () => {
    const mockEvents = [
      { eventId: "evt-1", type: "ORDER_CREATED", orderId: "mock-order-id" },
    ]

    // find() devuelve un objeto chainable con sort/skip/limit
    ;(TimelineEvent.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockEvents),
    })

    const res = await request(app).get("/orders/mock-order-id/timeline")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})