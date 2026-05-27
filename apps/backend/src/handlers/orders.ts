import { v4 as uuid } from "uuid"
import { Order } from "../models/Order"
import { CartItem } from "../models/CartItem"
import { Idempotency } from "../models/Idempotency"
import { calculateOrderPricing } from "../services/order-pricing.service"
import { createTimelineEvent } from "../services/timeline.service"

// ─── Order number counter (in-memory) ────────────────────────────────────────
let orderCounter = 0
const generateOrderNumber = (): string => {
  orderCounter += 1
  return `ORD-${new Date().getFullYear()}-${String(orderCounter).padStart(5, "0")}`
}

// POST /orders
export const createOrder = async (req: any, res: any) => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined
  const { userId, correlationId } = req.body

  // 1. Idempotency check
  if (idempotencyKey) {
    const existing = await Idempotency.findOne({ key: idempotencyKey })
    if (existing) {
      return res.status(202).json({
        orderId: existing.orderId,
        orderNumber: existing.orderNumber,
      })
    }
  }

  // 2. Read cart
  const cartItems = await CartItem.find({ userId })
  if (!cartItems.length) {
    return res.status(400).json({ error: "Cart is empty" })
  }

  // 3. Server-side pricing
  const subtotalCents = cartItems.reduce((s, i) => s + (i.totalPriceCents ?? 0), 0)
  const pricing = calculateOrderPricing(subtotalCents)

  // 4. Friendly order number
  const orderNumber = generateOrderNumber()

  // 5. Item snapshots
  const orderItems = cartItems.map((ci) => ({
    productId: ci.productId,
    productName: ci.productName,
    basePriceCents: ci.basePriceCents,
    selectedModifiers: ci.selectedModifiers,
    quantity: ci.quantity,
    totalPriceCents: ci.totalPriceCents,
  }))

  // 6. Persist order
  const order = await Order.create({
    orderNumber,
    userId,
    status: "PENDING",
    items: orderItems,
    ...pricing,
  })

  const orderId = order._id.toString()

  // 7. Idempotency record
  if (idempotencyKey) {
    await Idempotency.create({ key: idempotencyKey, orderId, orderNumber })
  }

  // 8. Clear cart
  await CartItem.deleteMany({ userId })

  // 9. ORDER_PLACED — use MongoDB _id as orderId in timeline
  // GET /orders/:orderId/timeline works directly with the URL param
  await createTimelineEvent({
    orderId,
    userId,
    type: "ORDER_PLACED",
    source: "web",
    correlationId,
    payload: { orderNumber, status: "PENDING", ...pricing } as Record<string, unknown>,
  })

  // 10. Auto status flow
  const statusFlow = [
    { delay: 5000, from: "PENDING", to: "PREPARING" },
    { delay: 10000, from: "PREPARING", to: "ON_THE_WAY" },
    { delay: 15000, from: "ON_THE_WAY", to: "DELIVERED" },
  ]

  statusFlow.forEach(({ delay, from, to }) => {
    setTimeout(async () => {
      await Order.findByIdAndUpdate(orderId, { status: to })
      await createTimelineEvent({
        orderId,
        userId,
        type: "ORDER_STATUS_CHANGED",
        source: "worker",
        correlationId,
        payload: { orderNumber, from, to } as Record<string, unknown>,
      })
      console.log(`[order] ${orderNumber}: ${from} → ${to}`)
    }, delay)
  })

  return res.status(202).json({ orderId, orderNumber })
}

// GET /orders/:orderId
export const getOrder = async (req: any, res: any) => {
  const { orderId } = req.params
  const order = await Order.findById(orderId)
  if (!order) return res.status(404).json({ error: "Order not found" })
  return res.json(order)
}

// GET /orders/user/:userId
export const getOrdersByUser = async (req: any, res: any) => {
  const { userId } = req.params

  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(50, Number(req.query.pageSize) || 5)
  const sort = req.query.sort === "asc" ? 1 : -1
  const skip = (page - 1) * pageSize

  const query: Record<string, unknown> = { userId }
  if (req.query.status) query.status = req.query.status

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: sort }).skip(skip).limit(pageSize),
    Order.countDocuments(query),
  ])

  return res.json({
    orders,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  })
}

// PATCH /orders/:orderId/status
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
    payload: { orderNumber: order.orderNumber, newStatus: status } as Record<string, unknown>,
  })

  return res.json(order)
}