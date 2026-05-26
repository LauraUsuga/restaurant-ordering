import { createTimelineEvent } from "../timeline.service"
import { TimelineEvent } from "../../models/TimelineEvent"

// Mock the Mongoose model
jest.mock("../../models/TimelineEvent", () => ({
  TimelineEvent: {
    create: jest.fn(),
  },
}))

const mockCreate = TimelineEvent.create as jest.Mock

const baseInput = {
  orderId: "order-abc",
  userId: "user-1",
  type: "ORDER_PLACED",
  source: "web" as const,
  correlationId: "corr-xyz",
  payload: { status: "PENDING", totalCents: 5000 },
}

describe("createTimelineEvent", () => {
  beforeEach(() => {
    mockCreate.mockClear()
    mockCreate.mockResolvedValue({ eventId: "generated-uuid", ...baseInput })
  })

  it("calls TimelineEvent.create with all required fields", async () => {
    await createTimelineEvent(baseInput)

    expect(mockCreate).toHaveBeenCalledTimes(1)
    const arg = mockCreate.mock.calls[0][0]

    expect(arg.eventId).toBeDefined()
    expect(arg.timestamp).toBeDefined()
    expect(arg.orderId).toBe("order-abc")
    expect(arg.userId).toBe("user-1")
    expect(arg.type).toBe("ORDER_PLACED")
    expect(arg.source).toBe("web")
    expect(arg.correlationId).toBe("corr-xyz")
  })

  it("generates a unique eventId (uuid format)", async () => {
    await createTimelineEvent(baseInput)
    const arg = mockCreate.mock.calls[0][0]
    expect(arg.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  it("generates ISO 8601 timestamp", async () => {
    await createTimelineEvent(baseInput)
    const arg = mockCreate.mock.calls[0][0]
    expect(new Date(arg.timestamp).toISOString()).toBe(arg.timestamp)
  })

  it("stores the original payload (not masked)", async () => {
    const payloadWithPII = { email: "user@test.com", totalCents: 1000 }
    await createTimelineEvent({ ...baseInput, payload: payloadWithPII })
    const arg = mockCreate.mock.calls[0][0]
    // stored payload should contain original email
    expect(arg.payload.email).toBe("user@test.com")
  })

  it("returns the created event", async () => {
    const result = await createTimelineEvent(baseInput)
    expect(result).toBeDefined()
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  it("propagates DB errors", async () => {
    mockCreate.mockRejectedValueOnce(new Error("DB connection failed"))
    await expect(createTimelineEvent(baseInput)).rejects.toThrow("DB connection failed")
  })

  it("generates different eventIds for consecutive calls", async () => {
    mockCreate.mockResolvedValue({})
    await createTimelineEvent(baseInput)
    await createTimelineEvent(baseInput)

    const id1 = mockCreate.mock.calls[0][0].eventId
    const id2 = mockCreate.mock.calls[1][0].eventId
    expect(id1).not.toBe(id2)
  })
})