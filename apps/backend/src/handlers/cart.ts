import { calculateOrderPricing } from "../services/order-pricing.service";
import { calculateItemPrice } from "../services/pricing.service";
import { createTimelineEvent } from "../services/timeline.service";
import { CartItem } from "../models/CartItem"
import { Product } from "../models/Product"

// POST /cart/items
export const addCartItem = async (req: any, res: any) => {
  const { userId, productId, quantity, selectedModifiers, correlationId } = req.body

  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ error: "Product not found" })

  const totalPriceCents = calculateItemPrice(product, quantity, selectedModifiers)

  const item = await CartItem.create({
    userId,
    productId,
    productName: product.name,
    quantity,
    selectedModifiers,
    basePriceCents: product.priceCents,
    totalPriceCents
  })

  const populatedItem = await item.populate("productId")

  await createTimelineEvent({
    orderId: "cart",
    userId,
    type: "CART_ITEM_ADDED",
    source: "web",
    correlationId,
    payload: { productId, quantity, totalPriceCents, itemId: item._id }
  })

  return res.status(201).json(populatedItem)
}

// PATCH /cart/items/:id
export const updateCartItem = async (req: any, res: any) => {
  const { id } = req.params
  const { quantity } = req.body

  const item = await CartItem.findById(id)

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    })
  }

  item.quantity = quantity

  // recalcular total
  item.totalPriceCents =
    (item.basePriceCents ?? 0) * quantity

  await item.save()

  const populatedItem =
    await item.populate("productId")

  await createTimelineEvent({
    orderId: "cart",
    userId: item.userId!,
    type: "CART_ITEM_UPDATED",
    source: "web",
    correlationId:
      req.headers["x-correlation-id"] ||
      "unknown",
    payload: {
      itemId: id,
      quantity
    }
  })

  return res.json(populatedItem)
}

// DELETE /cart/items/:id
export const removeCartItem = async (req: any, res: any) => {
  const { id } = req.params
  const item = await CartItem.findByIdAndDelete(id)
  if (!item) return res.status(404).json({ error: "Item not found" })

  await createTimelineEvent({
    orderId: "cart",
    userId: item.userId!,
    type: "CART_ITEM_REMOVED",
    source: "web",
    correlationId: req.headers["x-correlation-id"] || "unknown",
    payload: { itemId: id }
  })

  return res.status(204).send()
}

// GET /cart/:userId
export const getCart = async (req: any, res: any) => {
  const { userId } = req.params
  const items = await CartItem.find({ userId }).populate("productId")
  const subtotalCents = items.reduce((sum, i) => sum + (i.totalPriceCents ?? 0), 0)
  const pricing = calculateOrderPricing(subtotalCents)

  await createTimelineEvent({
    orderId: "cart",
    userId,
    type: "PRICING_CALCULATED",
    source: "api",
    correlationId: req.headers["x-correlation-id"] || "unknown",
    payload: pricing
  })

  return res.json({ items, pricing })
}