import request from "supertest"
import app from "../src/app"

describe("Menu API", () => {
  it("should return menu products", async () => {
    const res = await request(app).get("/menu")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})