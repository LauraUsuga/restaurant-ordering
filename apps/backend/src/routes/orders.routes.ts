import { Router } from "express"
import { CartItem } from "../models/CartItem"
import { Order } from "../models/Order"
import { Idempotency } from "../models/Idempotency"
import { TimelineEvent } from "../models/TimelineEvent"
import { calculateOrderPricing } from "../services/order-pricing.service"
import { createTimelineEvent } from "../services/timeline.service"

const router = Router()

router.post("/", async (req, res) => {
  const idempotencyKey =
    req.header("Idempotency-Key")

  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Idempotency-Key required"
    })
  }

  const existing =
    await Idempotency.findOne({
      key: idempotencyKey
    })

  if (existing) {
    return res.status(202).json({
      orderId: existing.orderId
    })
  }

  const { userId, correlationId } =
    req.body

  const cartItems =
    await CartItem.find({ userId })

  const subtotalCents =
    cartItems.reduce(
      (acc, item) =>
        acc + (item.totalPriceCents ?? 0),
      0
    )

  const pricing =
    calculateOrderPricing(
      subtotalCents
    )

  const order = await Order.create({
    userId,
    status: "PENDING",
    items: cartItems,
    ...pricing
  })

  await Idempotency.create({
    key: idempotencyKey,
    orderId: order._id.toString()
  })

  await createTimelineEvent({
    orderId: order._id.toString(),
    userId,
    type: "ORDER_PLACED",
    source: "api",
    correlationId,
    payload: {
      totalCents: pricing.totalCents
    }
  })

  setTimeout(async () => {
    await Order.findByIdAndUpdate(
      order._id,
      {
        status: "PREPARING"
      }
    )

    await createTimelineEvent({
      orderId: order._id.toString(),
      userId,
      type: "ORDER_STATUS_CHANGED",
      source: "worker",
      correlationId,
      payload: {
        from: "PENDING",
        to: "PREPARING"
      }
    })
  }, 5000)

  return res.status(202).json({
    orderId: order._id
  })
})

/**
 * GET /orders/:orderId/timeline
 */
router.get(
  "/:orderId/timeline",
  async (req, res) => {
    const page = Number(req.query.page || 1)

    const pageSize = Math.min(
      Number(req.query.pageSize || 20),
      50
    )

    const skip =
      (page - 1) * pageSize

    const events =
      await TimelineEvent.find({
        orderId: req.params.orderId
      })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(pageSize)

    return res.json(events)
  }
)

export default router