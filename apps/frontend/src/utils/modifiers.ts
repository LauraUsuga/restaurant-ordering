/**
 * Verifica si una opción de modifier ya está seleccionada dentro de un grupo.
 *
 * @param selected - estado actual de modifiers seleccionados por grupo
 * @param groupId - id del grupo de modifiers
 * @param optId - id de la opción a verificar
 * @returns boolean indicando si está seleccionada
 */
export function isModifierSelected(selected: any, groupId: string, optId: string) {
  return (selected[groupId] || []).some((m: any) => m.optionId === optId)
}

/**
 * Valida si un producto cumple los requisitos de selección de modifiers.
 *
 * Ejemplo:
 * - grupos requeridos
 * - mínimo de opciones seleccionadas por grupo
 *
 * @param product - producto con configuración de modifierGroups
 * @param selected - modifiers seleccionados actualmente
 * @returns boolean indicando si el producto es válido para agregar al carrito
 */
export function meetsRequirements(product: any, selected: any) {
  if (!product.modifierGroups) return true

  return product.modifierGroups
    .filter((g: any) => g.required)
    .every((g: any) => (selected[g.id] || []).length >= g.min)
}

/**
 * Construye un objeto normalizado de modifier para almacenamiento en carrito/order.
 *
 * @param group - grupo de modifier
 * @param opt - opción seleccionada
 * @returns objeto estructurado del modifier
 */
export function buildModifier(group: any, opt: any) {
  return {
    groupId: group.id,
    optionId: opt.id,
    name: opt.name,
    priceCents: opt.priceCents,
  }
}