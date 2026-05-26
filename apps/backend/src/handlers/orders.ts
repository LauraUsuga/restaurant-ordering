import { v4 as uuid } from "uuid"
import { Order } from "../models/Order"
import { CartItem } from "../models/CartItem"
import { Idempotency } from "../models/Idempotency"
import { calculateOrderPricing } from "../services/order-pricing.service";
import { createTimelineEvent } from "../services/timeline.service";

// POST /orders
export const createOrder = async (req: any, res: any) => {
  const idempotencyKey = req.headers["idempotency-key"]
  const { userId, correlationId } = req.body

  if (idempotencyKey) {
    const existing = await Idempotency.findOne({ key: idempotencyKey })
    if (existing) return res.status(202).json({ orderId: existing.orderId })
  }

  const cartItems = await CartItem.find({ userId })
  if (!cartItems.length) return res.status(400).json({ error: "Cart is empty" })

  const subtotalCents = cartItems.reduce((s, i) => s + (i.totalPriceCents ?? 0), 0)
  const pricing = calculateOrderPricing(subtotalCents)

  const order = await Order.create({
    userId,
    status: "PENDING",
    items: cartItems,
    ...pricing
  })

  if (idempotencyKey) {
    await Idempotency.create({ key: idempotencyKey, orderId: order._id.toString() })
  }

  await CartItem.deleteMany({ userId })

  await createTimelineEvent({
    orderId: order._id.toString(),
    userId,
    type: "ORDER_PLACED",
    source: "web",
    correlationId,
    payload: { status: "PENDING", ...pricing }
  })

  return res.status(202).json({ orderId: order._id })
}

// PATCH /orders/:orderId/status  — para workers que cambian estado
export const updateOrderStatus = async (req: any, res: any) => {
  const { orderId } = req.params
  const { status, correlationId } = req.body

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
  if (!order) return res.status(404).json({ error: "Order not found" })

  await createTimelineEvent({
    orderId,
    userId: order.userId!,
    type: "ORDER_STATUS_CHANGED",
    source: "worker",
    correlationId: correlationId || uuid(),
    payload: { previousStatus: "PENDING", newStatus: status }
  })

  return res.json(order)
}