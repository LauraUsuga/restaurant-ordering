import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    userId: String,

    status: {
      type: String,
      default: "PENDING"
    },

    items: Array,

    subtotalCents: Number,
    taxCents: Number,
    serviceFeeCents: Number,
    totalCents: Number
  },
  { timestamps: true }
)

export const Order = mongoose.model(
  "Order",
  OrderSchema
)