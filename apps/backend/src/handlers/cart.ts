import { calculateOrderPricing } from "../services/order-pricing.service"
import { calculateItemPrice } from "../services/pricing.service"
import { createTimelineEvent } from "../services/timeline.service"
import { CartItem } from "../models/CartItem"
import { Product } from "../models/Product"

// POST /cart/items
export const addCartItem = async (req: any, res: any) => {
  const { userId, productId, quantity, selectedModifiers = [], correlationId } = req.body

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
    totalPriceCents,
  })

  const populatedItem = await item.populate("productId")

  await createTimelineEvent({
    orderId: "cart",
    userId,
    type: "CART_ITEM_ADDED",
    source: "web",
    correlationId,
    payload: { productId, productName: product.name, quantity, totalPriceCents, itemId: item._id },
  })

  return res.status(201).json(populatedItem)
}

// PATCH /cart/items/:id
export const updateCartItem = async (req: any, res: any) => {
  const { id } = req.params
  const { quantity } = req.body
  const correlationId = req.headers["x-correlation-id"] || "unknown"

  const item = await CartItem.findById(id)
  if (!item) return res.status(404).json({ error: "Item not found" })

  const modifierTotal = (item.selectedModifiers as any[]).reduce(
    (sum: number, m: any) => sum + (m.priceCents || 0), 0
  )

  item.quantity = quantity
  item.totalPriceCents = (item.basePriceCents ?? 0 + modifierTotal) * quantity
  await item.save()

  const populatedItem = await item.populate("productId")

  await createTimelineEvent({
    orderId: "cart",
    userId: item.userId!,
    type: "CART_ITEM_UPDATED",
    source: "web",
    correlationId,
    payload: { itemId: id, quantity, totalPriceCents: item.totalPriceCents },
  })

  return res.json(populatedItem)
}

// DELETE /cart/items/:id
export const removeCartItem = async (req: any, res: any) => {
  const { id } = req.params
  const correlationId = req.headers["x-correlation-id"] || "unknown"

  const item = await CartItem.findByIdAndDelete(id)
  if (!item) return res.status(404).json({ error: "Item not found" })

  await createTimelineEvent({
    orderId: "cart",
    userId: item.userId!,
    type: "CART_ITEM_REMOVED",
    source: "web",
    correlationId,
    payload: { itemId: id },
  })

  return res.status(204).send()
}

// GET /cart/:userId
export const getCart = async (req: any, res: any) => {
  const { userId } = req.params
  const correlationId = req.headers["x-correlation-id"] || "unknown"

  const items = await CartItem.find({ userId }).populate("productId")
  const subtotalCents = items.reduce((sum, i) => sum + (i.totalPriceCents ?? 0), 0)
  const pricing = calculateOrderPricing(subtotalCents)

  await createTimelineEvent({
    orderId: "cart",
    userId,
    type: "PRICING_CALCULATED",
    source: "api",
    correlationId,
    payload: pricing as unknown as Record<string, unknown>,
  })

  return res.json({ items, pricing })
}