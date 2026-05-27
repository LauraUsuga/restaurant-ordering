import mongoose from "mongoose"

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const ModifierOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceCents: { type: Number, default: 0 },
  },
  { _id: false }
)

const ModifierGroupSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 1 },
    options: { type: [ModifierOptionSchema], default: [] },
  },
  { _id: false }
)

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    priceCents: { type: Number, required: true },
    category: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    modifierGroups: { type: [ModifierGroupSchema], default: [] },
  },
  { timestamps: true }
)

export const Product = mongoose.model("Product", ProductSchema)