import { Router } from "express"
import { getTimeline } from "../handlers/timeline"
import { createOrder, updateOrderStatus } from "../handlers/orders";

const router = Router()

router.post("/", createOrder)
router.patch("/:orderId/status", updateOrderStatus)
router.get("/:orderId/timeline", getTimeline)

export default router