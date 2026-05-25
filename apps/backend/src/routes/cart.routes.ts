import { Router } from "express"
import { Product } from "../models/Product"
import { CartItem } from "../models/CartItem"
import { calculateItemPrice } from "../services/pricing.services";
import { createTimelineEvent } from "../services/timeline.service"

const router = Router()

router.post("/items", async (req, res) => {
  const { userId, productId, quantity, selectedModifiers, correlationId } = req.body

  const product = await Product.findById(productId)

  if (!product) {
    await createTimelineEvent({
      orderId: "cart",
      userId,
      type: "VALIDATION_FAILED",
      source: "api",
      correlationId,
      payload: {
        reason: "PRODUCT_NOT_FOUND",
        productId
      }
    })

    return res.status(404).json({
      error: "Product not found"
    })
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

  await createTimelineEvent({
    orderId: "cart",
    userId,
    type: "PRICING_CALCULATED",
    source: "api",
    correlationId,
    payload: {
      subtotalCents: totalPriceCents
    }
  })

  const event = createTimelineEvent({
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

router.patch("/items/:id", async (req, res) => {
  const { quantity } = req.body

  const item = await CartItem.findById(
    req.params.id
  )

  if (!item) {
    return res.status(404).json({
      error: "Cart item not found"
    })
  }

  item.quantity = quantity

  item.totalPriceCents =
    (item.basePriceCents ?? 0) * quantity

  await item.save()

  await createTimelineEvent({
    orderId: "cart",
    userId: item.userId ?? "mock-user-1",
    type: "CART_ITEM_UPDATED",
    source: "api",
    correlationId: "cart-update",
    payload: {
      itemId: item._id,
      quantity
    }
  })

  return res.json(item)
})

router.delete(
  "/items/:id",
  async (req, res) => {
    const item =
      await CartItem.findById(
        req.params.id
      )

    if (!item) {
      return res.status(404).json({
        error: "Cart item not found"
      })
    }

    await CartItem.findByIdAndDelete(
      req.params.id
    )

    await createTimelineEvent({
      orderId: "cart",
      userId: item.userId ?? "mock-user-1",
      type: "CART_ITEM_REMOVED",
      source: "api",
      correlationId: "cart-delete",
      payload: {
        itemId: item._id
      }
    })

    return res.json({
      success: true
    })
  }
)

router.get("/:userId", async (req, res) => {
  const cartItems =
    await CartItem.find({
      userId: req.params.userId
    })

  const subtotalCents =
    cartItems.reduce(
      (acc, item) =>
        acc +
        (item.totalPriceCents ?? 0),
      0
    )

  const taxPercent =
    Number(process.env.TAX_PERCENT) || 10

  const serviceFeePercent =
    Number(
      process.env.SERVICE_FEE_PERCENT
    ) || 5

  const taxCents = Math.round(
    subtotalCents *
    (taxPercent / 100)
  )

  const serviceFeeCents =
    Math.round(
      subtotalCents *
      (serviceFeePercent / 100)
    )

  const totalCents =
    subtotalCents +
    taxCents +
    serviceFeeCents

  return res.json({
    items: cartItems,
    pricing: {
      subtotalCents,
      taxCents,
      serviceFeeCents,
      totalCents
    }
  })
})

export default router