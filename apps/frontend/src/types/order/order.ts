import type { CartItem } from "./cart";

export type Order = {
  _id: string
  userId: string
  status: string
  orderNumber?: string
  totalCents: number
  subtotalCents: number
  taxCents: number
  serviceFeeCents: number
  items: CartItem[]
  createdAt?: string
}