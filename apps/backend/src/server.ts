import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { seedProducts } from './seed/products.seed'
import menuRoutes from './routes/menu.routes'
import cartRoutes from './routes/cart.routes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.get('/health', (_, res) => {
  res.json({
    message: 'API running'
  })
})
app.use("/menu", menuRoutes)
app.use("/cart", cartRoutes)
const mongoUri = process.env.MONGO_URI!

mongoose.connect(mongoUri).then(async () => {
  console.log("MongoDB Atlas connected")

  await seedProducts()
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})

export const handler = app