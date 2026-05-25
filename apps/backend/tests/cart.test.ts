import request from "supertest"
import app from "../src/app"
import { CartItem } from "../src/models/CartItem"
import { Product } from "../src/models/Product"

const userId = "test-user"

describe("Cart API", () => {
  let itemId: string

  beforeAll(() => {
    // Product.findById devuelve un producto válido para que no falle la ruta
    ;(Product.findById as jest.Mock).mockResolvedValue({
      _id: "test-product",
      name: "Burger",
      priceCents: 1000,
    })

    // CartItem.create devuelve item con _id
    ;(CartItem.create as jest.Mock).mockResolvedValue({
      _id: "mock-cart-item-id",
      productId: "test-product",
      quantity: 1,
      userId,
      basePriceCents: 1000,
      totalPriceCents: 1000,
    })

    // CartItem.findById devuelve item para PATCH y DELETE
    ;(CartItem.findById as jest.Mock).mockResolvedValue({
      _id: "mock-cart-item-id",
      userId,
      quantity: 1,
      basePriceCents: 1000,
      totalPriceCents: 1000,
      save: jest.fn().mockResolvedValue({
        _id: "mock-cart-item-id",
        quantity: 2,
        basePriceCents: 1000,
        totalPriceCents: 2000,
      }),
    })

    ;(CartItem.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "mock-cart-item-id",
    })
  })

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/cart/items")
      .send({
        userId,
        productId: "test-product",
        quantity: 1,
        selectedModifiers: [],
        correlationId: "test",
      })

    expect(res.status).toBe(200)
    expect(res.body.item).toBeDefined()
    itemId = res.body.item._id
  })

  it("should update cart item", async () => {
    const res = await request(app)
      .patch(`/cart/items/${itemId}`)
      .send({ quantity: 2 })

    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(2)
  })

  it("should delete cart item", async () => {
    const res = await request(app).delete(`/cart/items/${itemId}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})