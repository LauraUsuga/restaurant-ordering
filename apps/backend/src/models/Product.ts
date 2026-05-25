import mongoose from "mongoose"

const ModifierOptionSchema = new mongoose.Schema({
  id: String,
  name: String,
  priceCents: { type: Number, default: 0 }
})

const ModifierGroupSchema = new mongoose.Schema({
  id: String,
  name: String,
  required: Boolean,
  min: Number,
  max: Number,
  options: [ModifierOptionSchema]
})

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    priceCents: Number,
    modifierGroups: [ModifierGroupSchema]
  },
  { timestamps: true }
)

export const Product = mongoose.model("Product", ProductSchema)