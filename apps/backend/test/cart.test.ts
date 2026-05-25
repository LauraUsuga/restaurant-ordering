import request from "supertest"
import app from "../src/app"

const userId = "test-user"

describe("Cart API", () => {
  let itemId: string

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/cart/items")
      .send({
        userId,
        productId: "test-product",
        quantity: 1,
        selectedModifiers: [],
        correlationId: "test"
      })

    expect(res.status).toBe(200)
    expect(res.body.item).toBeDefined()

    itemId = res.body.item._id
  })

  it("should update cart item", async () => {
    const res = await request(app)
      .patch(`/cart/items/${itemId}`)
      .send({
        quantity: 2
      })

    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(2)
  })

  it("should delete cart item", async () => {
    const res = await request(app).delete(
      `/cart/items/${itemId}`
    )

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})