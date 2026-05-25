export const calculateItemPrice = (product: any, quantity: number, modifiers: any[]) => {
  let total = product.priceCents

  for (const mod of modifiers) {
    total += mod.priceCents || 0
  }

  return total * quantity
}