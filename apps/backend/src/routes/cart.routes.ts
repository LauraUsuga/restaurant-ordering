import { Router } from "express"
import { Product } from "../models/Product"
import { CartItem } from "../models/CartItem"
import { calculateItemPrice } from "../services/pricing.services";
import { createEvent } from "../services/timeline.service"

const router = Router()

router.post("/items", async (req, res) => {
  const { userId, productId, quantity, selectedModifiers, correlationId } = req.body

  const product = await Product.findById(productId)

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  const totalPriceCents = calculateItemPrice(product, quantity, selectedModifiers)

  const item = await CartItem.create({
    userId,
    productId,
    quantity,
    selectedModifiers,
    basePriceCents: product.priceCents,
    totalPriceCents
  })

  const event = createEvent({
    orderId: "cart", // simplificado por ahora
    userId,
    type: "CART_ITEM_ADDED",
    source: "api",
    correlationId,
    payload: item
  })

  console.log("EVENT:", event)

  return res.json({
    item,
    event
  })
})

export default router