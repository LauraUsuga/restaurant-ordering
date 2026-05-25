import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({
    message: 'API running'
  })
})

const mongoUri = process.env.MONGO_URI!

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Mongo connected')
  })
  .catch(console.error)

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})

export const handler = app