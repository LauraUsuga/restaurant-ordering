import type { ModifierGroup } from "./modifiers";

export type Product = {
  _id: string
  name: string
  description: string
  priceCents: number
  category: string
  imageUrl: string
  modifierGroups?: ModifierGroup[]
}