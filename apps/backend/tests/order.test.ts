import request from "supertest"
import app from "../src/app"
import { Order } from "../src/models/Order"
import { Idempotency } from "../src/models/Idempotency"

describe("Orders API", () => {
  it("should create order with idempotency", async () => {
    ;(Idempotency.findOne as jest.Mock).mockResolvedValue(null)
    ;(Order.create as jest.Mock).mockResolvedValue({
      _id: "mock-order-id",
      userId: "test-user",
      status: "PENDING",
    })
    ;(Idempotency.create as jest.Mock).mockResolvedValue({
      key: "idem-test-1",
      orderId: "mock-order-id",
    })

    const res = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "idem-test-1")
      .send({ userId: "test-user", correlationId: "test" })

    expect(res.status).toBe(202)
    expect(res.body.orderId).toBeDefined()
  })

  it("should return same order for same idempotency key", async () => {
    const existingOrder = { _id: "mock-order-id", userId: "test-user", status: "PENDING" }

    // Primera llamada: no existe → crea
    ;(Idempotency.findOne as jest.Mock).mockResolvedValueOnce(null)
    ;(Order.create as jest.Mock).mockResolvedValue(existingOrder)
    ;(Idempotency.create as jest.Mock).mockResolvedValue({
      key: "idem-test-2",
      orderId: "mock-order-id",
    })

    // Segunda llamada: ya existe → devuelve misma
    ;(Idempotency.findOne as jest.Mock).mockResolvedValueOnce({
      key: "idem-test-2",
      orderId: "mock-order-id",
    })

    const first = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "idem-test-2")
      .send({ userId: "test-user", correlationId: "test" })

    const second = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "idem-test-2")
      .send({ userId: "test-user", correlationId: "test" })

    expect(second.body.orderId).toBe(first.body.orderId)
  })
})