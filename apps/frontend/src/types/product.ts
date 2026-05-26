export type ModifierOption = {
  id: string
  name: string
  priceCents: number
}
 
export type ModifierGroup = {
  id: string
  name: string
  required: boolean
  min: number
  max: number
  options: ModifierOption[]
}
 
export type Product = {
  _id: string
  name: string
  description: string
  priceCents: number
  category: string
  imageUrl: string
  modifierGroups?: ModifierGroup[]
}