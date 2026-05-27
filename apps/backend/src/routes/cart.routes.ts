import { Router } from "express"
import {
  addCartItem,
  updateCartItem,
  removeCartItem,
  getCart,
} from "../handlers/cart"

const router = Router()

router.post("/items", addCartItem)
router.patch("/items/:id", updateCartItem)
router.delete("/items/:id", removeCartItem)
router.get("/:userId", getCart)

export default router