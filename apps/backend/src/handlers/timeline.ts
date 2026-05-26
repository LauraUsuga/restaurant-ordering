import { TimelineEvent } from "../models/TimelineEvent"

// GET /orders/:orderId/timeline
export const getTimeline = async (req: any, res: any) => {
  const { orderId } = req.params
  const pageSize = Math.min(Number(req.query.pageSize) || 20, 50)
  const page = Number(req.query.page) || 1
  const skip = (page - 1) * pageSize

  const events = await TimelineEvent
    .find({ orderId })
    .sort({ timestamp: 1 })
    .skip(skip)
    .limit(pageSize)

  const total = await TimelineEvent.countDocuments({ orderId })

  return res.json({
    events,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  })
}