export type ProductRef = {
  _id: string
  name: string
}

export type CartItem = {
  _id: string
  productName: string
  quantity: number
  totalPriceCents: number
  productId: ProductRef
  basePriceCents: number
  selectedModifiers?: {
    groupId: string
    optionId: string
    name: string
    priceCents: number
  }[]
}