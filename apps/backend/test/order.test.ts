import request from "supertest"
import app from "../src/app"

describe("Orders API", () => {
  it("should create order with idempotency", async () => {
    const key = "idem-test-1"

    const res = await request(app)
      .post("/orders")
      .set("Idempotency-Key", key)
      .send({
        userId: "test-user",
        correlationId: "test"
      })

    expect(res.status).toBe(202)
    expect(res.body.orderId).toBeDefined()
  })

  it("should return same order for same idempotency key", async () => {
    const key = "idem-test-2"

    const first = await request(app)
      .post("/orders")
      .set("Idempotency-Key", key)
      .send({
        userId: "test-user",
        correlationId: "test"
      })

    const second = await request(app)
      .post("/orders")
      .set("Idempotency-Key", key)
      .send({
        userId: "test-user",
        correlationId: "test"
      })

    expect(second.body.orderId).toBe(
      first.body.orderId
    )
  })
})