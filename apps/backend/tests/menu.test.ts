import request from "supertest"
import app from "../src/app"
import { Product } from "../src/models/Product"

describe("Menu API", () => {
  it("should return menu products", async () => {
    ;(Product.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        { _id: "prod-1", name: "Burger", priceCents: 1000 },
        { _id: "prod-2", name: "Fries", priceCents: 500 },
      ]),
      then: (resolve: any) =>
        Promise.resolve([
          { _id: "prod-1", name: "Burger", priceCents: 1000 },
          { _id: "prod-2", name: "Fries", priceCents: 500 },
        ]).then(resolve),
    })

    const res = await request(app).get("/menu")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})