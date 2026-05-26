import { Router } from "express"
import { getTimeline } from "../handlers/timeline"
import { createOrder, getOrder, getOrdersByUser, updateOrderStatus } from "../handlers/orders";

const router = Router()

router.post("/", createOrder)
router.get("/user/:userId", getOrdersByUser)
router.get("/:orderId", getOrder)
router.patch("/:orderId/status", updateOrderStatus)
router.get("/:orderId/timeline", getTimeline)

export default router