import request from "supertest"
import app from "../src/app"

describe("Timeline API", () => {
  it("should return timeline events array", async () => {
    const orderId = "mock-order-id"

    const res = await request(app).get(
      `/orders/${orderId}/timeline`
    )

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})