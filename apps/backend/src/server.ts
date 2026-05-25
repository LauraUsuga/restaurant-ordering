import dotenv from "dotenv"
import mongoose from "mongoose"
import app from "./app"
import { seedProducts } from "./seed/products.seed"

dotenv.config()

const mongoUri = process.env.MONGO_URI!

const isTest = process.env.NODE_ENV === "test"

if (!isTest) {
  mongoose.connect(mongoUri).then(async () => {
    console.log("MongoDB Atlas connected")
    await seedProducts()
  })

  const port = process.env.PORT || 3001

  app.listen(port, () => {
    console.log(`Server running on ${port}`)
  })
}