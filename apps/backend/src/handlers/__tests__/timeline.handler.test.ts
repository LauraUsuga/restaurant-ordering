import { getTimeline } from "../timeline"

jest.mock("../../models/TimelineEvent", () => ({
  TimelineEvent: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}))

import { TimelineEvent } from "../../models/TimelineEvent"

const mockFind = TimelineEvent.find as jest.Mock
const mockCount = TimelineEvent.countDocuments as jest.Mock

const makeRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const fakeEvents = [
  { eventId: "e1", timestamp: "2025-01-01T10:00:00.000Z", type: "ORDER_PLACED" },
  { eventId: "e2", timestamp: "2025-01-01T10:05:00.000Z", type: "ORDER_STATUS_CHANGED" },
]

// Helper to mock the Mongoose chained query: .find().sort().skip().limit()
const mockChain = (returnValue: any) => {
  const chain: any = {}
  chain.sort = jest.fn().mockReturnValue(chain)
  chain.skip = jest.fn().mockReturnValue(chain)
  chain.limit = jest.fn().mockResolvedValue(returnValue)
  return chain
}

describe("getTimeline", () => {
  beforeEach(() => {
    mockFind.mockClear()
    mockCount.mockClear()
  })

  it("returns events with pagination metadata", async () => {
    mockFind.mockReturnValueOnce(mockChain(fakeEvents))
    mockCount.mockResolvedValueOnce(2)

    const req: any = {
      params: { orderId: "order-1" },
      query: { page: "1", pageSize: "20" },
    }
    const res = makeRes()
    await getTimeline(req, res)

    expect(res.json).toHaveBeenCalledWith({
      events: fakeEvents,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 2,
        totalPages: 1,
      },
    })
  })

  it("queries by orderId", async () => {
    mockFind.mockReturnValueOnce(mockChain([]))
    mockCount.mockResolvedValueOnce(0)

    const req: any = {
      params: { orderId: "order-abc" },
      query: {},
    }
    await getTimeline(req, makeRes())

    expect(mockFind).toHaveBeenCalledWith({ orderId: "order-abc" })
  })

  it("sorts by timestamp ascending", async () => {
    const chain = mockChain([])
    mockFind.mockReturnValueOnce(chain)
    mockCount.mockResolvedValueOnce(0)

    const req: any = { params: { orderId: "o1" }, query: {} }
    await getTimeline(req, makeRes())

    expect(chain.sort).toHaveBeenCalledWith({ timestamp: 1 })
  })

  it("enforces pageSize max of 50", async () => {
    const chain = mockChain([])
    mockFind.mockReturnValueOnce(chain)
    mockCount.mockResolvedValueOnce(0)

    const req: any = {
      params: { orderId: "o1" },
      query: { pageSize: "999" }, // should clamp to 50
    }
    await getTimeline(req, makeRes())

    expect(chain.limit).toHaveBeenCalledWith(50)
  })

  it("defaults to page 1 and pageSize 20", async () => {
    const chain = mockChain([])
    mockFind.mockReturnValueOnce(chain)
    mockCount.mockResolvedValueOnce(0)

    const req: any = { params: { orderId: "o1" }, query: {} }
    await getTimeline(req, makeRes())

    expect(chain.skip).toHaveBeenCalledWith(0)   // (1-1)*20
    expect(chain.limit).toHaveBeenCalledWith(20)
  })

  it("calculates correct skip for page 3", async () => {
    const chain = mockChain([])
    mockFind.mockReturnValueOnce(chain)
    mockCount.mockResolvedValueOnce(60)

    const req: any = {
      params: { orderId: "o1" },
      query: { page: "3", pageSize: "10" },
    }
    await getTimeline(req, makeRes())

    expect(chain.skip).toHaveBeenCalledWith(20) // (3-1)*10
  })

  it("returns totalPages correctly", async () => {
    mockFind.mockReturnValueOnce(mockChain([]))
    mockCount.mockResolvedValueOnce(47)

    const req: any = {
      params: { orderId: "o1" },
      query: { pageSize: "10" },
    }
    const res = makeRes()
    await getTimeline(req, res)

    const result = res.json.mock.calls[0][0]
    expect(result.pagination.totalPages).toBe(5) // ceil(47/10)
  })
})