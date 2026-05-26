import { v4 as uuid } from "uuid"
import { Order } from "../models/Order"
import { CartItem } from "../models/CartItem"
import { Idempotency } from "../models/Idempotency"
import { calculateOrderPricing } from "../services/order-pricing.service";
import { createTimelineEvent } from "../services/timeline.service";

// POST /orders
export const createOrder = async (req: any, res: any) => {
  const idempotencyKey =
    req.headers["idempotency-key"]

  const { userId, correlationId } =
    req.body

  if (idempotencyKey) {
    const existing =
      await Idempotency.findOne({
        key: idempotencyKey
      })

    if (existing) {
      return res.status(202).json({
        orderId: existing.orderId
      })
    }
  }

  const cartItems =
    await CartItem.find({ userId })

  if (!cartItems.length) {
    return res.status(400).json({
      error: "Cart is empty"
    })
  }

  const subtotalCents =
    cartItems.reduce(
      (s, i) =>
        s + (i.totalPriceCents ?? 0),
      0
    )

  const pricing =
    calculateOrderPricing(
      subtotalCents
    )

  const order =
    await Order.create({
      userId,
      status: "PENDING",
      items: cartItems.map(i => ({
        ...i.toObject(),
        productName: i.productName
      })),
      ...pricing
    })

  if (idempotencyKey) {
    await Idempotency.create({
      key: idempotencyKey,
      orderId: order._id.toString()
    })
  }

  await CartItem.deleteMany({
    userId
  })

  await createTimelineEvent({
    orderId: order._id.toString(),
    userId,
    type: "ORDER_PLACED",
    source: "web",
    correlationId,
    payload: {
      status: "PENDING",
      ...pricing
    }
  })

  // AUTO STATUS FLOW
  const orderId =
    order._id.toString()

  const statusFlow = [
    {
      delay: 5000,
      from: "PENDING",
      to: "PREPARING"
    },
    {
      delay: 10000,
      from: "PREPARING",
      to: "ON_THE_WAY"
    },
    {
      delay: 15000,
      from: "ON_THE_WAY",
      to: "DELIVERED"
    }
  ]

  statusFlow.forEach(
    ({ delay, from, to }) => {
      setTimeout(async () => {
        await Order.findByIdAndUpdate(
          orderId,
          {
            status: to
          }
        )

        await createTimelineEvent({
          orderId,
          userId,
          type:
            "ORDER_STATUS_CHANGED",
          source: "worker",
          correlationId,
          payload: {
            from,
            to
          }
        })
        console.log(
          `Order ${orderId}: ${from} → ${to}`
        )
      }, delay)
    }
  )

  return res.status(202).json({
    orderId: order._id
  })
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

// GET /orders/:orderId/
export const getOrder = async (req: any, res: any) => {
  const { orderId } = req.params

  const order = await Order.findById(orderId)

  if (!order) {
    return res.status(404).json({
      error: "Order not found"
    })
  }

  return res.json(order)
}

// GET /orders/user/:userId
export const getOrdersByUser = async (req: any, res: any) => {
  const { userId } = req.params

  const page = Number(req.query.page || 1)
  const pageSize = Math.min(Number(req.query.pageSize || 5), 50)
  const sort = req.query.sort === "asc" ? 1 : -1
  const skip = (page - 1) * pageSize

  const status = req.query.status
  const orderId = req.query.orderId

  const query: any = { userId }

  if (status) query.status = status

  const baseQuery = Order.find(query)

  const orders = await baseQuery
    .sort({ createdAt: sort })
    .skip(skip)
    .limit(pageSize)

  const total = await Order.countDocuments(query)

  return res.json({
    orders,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}

// GET /orders/user/:userId?page=1&limit=10&sort=desc&query=...
export const getUserOrders = async (req: any, res: any) => {
  const { userId } = req.params

  const page = Number(req.query.page || 1)
  const limit = Math.min(Number(req.query.limit || 10), 50)
  const skip = (page - 1) * limit

  const sortDirection = req.query.sort === "asc" ? 1 : -1

  const orders = await Order.find({ userId })
    .sort({ createdAt: sortDirection })
    .skip(skip)
    .limit(limit)

  const total = await Order.countDocuments({ userId })

  return res.json({
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}