import express from 'express'
import cors from 'cors'
import menuRoutes from './routes/menu.routes'
import cartRoutes from './routes/cart.routes'
import ordersRoutes from './routes/orders.routes'
import { payloadLimit } from './middleware/payload-limit'

const app = express()

app.use(cors())
app.use(express.json())
app.use(payloadLimit)

app.get('/health', (_, res) => {
  res.json({ message: 'API running' })
})

app.use("/menu", menuRoutes)
app.use("/cart", cartRoutes)
app.use("/orders", ordersRoutes)

export default app