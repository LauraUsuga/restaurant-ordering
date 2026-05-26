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

export type Pricing = {
  subtotalCents: number
  taxCents: number
  serviceFeeCents: number
  totalCents: number
}

export type Order = {
  _id: string
  userId: string
  status: string
  totalCents: number
  subtotalCents: number
  taxCents: number
  serviceFeeCents: number
  items: CartItem[]
  createdAt?: string
}