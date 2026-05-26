/**
 * Calcula el precio total del producto incluyendo modifiers y cantidad.
 *
 * @param product - producto base
 * @param selected - modifiers seleccionados
 * @param qty - cantidad de unidades
 * @returns total en centavos (priceCents)
 */
export function calculateTotal(product: any, selected: any, qty: number) {
  const mods = Object.values(selected).flat() as any[]

  const extra = mods.reduce((a, m) => a + m.priceCents, 0)

  return (product.priceCents + extra) * qty
}