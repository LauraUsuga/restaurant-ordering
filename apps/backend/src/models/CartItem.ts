import mongoose from "mongoose"

const SelectedModifierSchema = new mongoose.Schema({
  groupId: String,
  optionId: String,
  name: String,
  priceCents: Number
})

const CartItemSchema = new mongoose.Schema(
  {
    userId: String,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    productName: String,
    quantity: Number,
    selectedModifiers: [SelectedModifierSchema],
    basePriceCents: Number,
    totalPriceCents: Number
  },
  { timestamps: true }
)

export const CartItem = mongoose.model("CartItem", CartItemSchema)