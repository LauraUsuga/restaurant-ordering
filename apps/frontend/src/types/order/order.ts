import type { CartItem } from "./cart";

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