import mongoose from "mongoose"

const IdempotencySchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true
  },

  orderId: String
})

export const Idempotency = mongoose.model(
  "Idempotency",
  IdempotencySchema
)