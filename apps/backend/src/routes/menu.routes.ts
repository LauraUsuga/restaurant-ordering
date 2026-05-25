import { Router } from "express"
import { Product } from "../models/Product"

const router = Router()

router.get("/", async (_, res) => {
  const products = await Product.find()
  res.json(products)
})

export default router