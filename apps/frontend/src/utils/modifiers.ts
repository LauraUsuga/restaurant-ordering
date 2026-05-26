export function isModifierSelected(selected: any, groupId: string, optId: string) {
  return (selected[groupId] || []).some((m: any) => m.optionId === optId)
}

export function meetsRequirements(product: any, selected: any) {
  if (!product.modifierGroups) return true

  return product.modifierGroups
    .filter((g: any) => g.required)
    .every((g: any) => (selected[g.id] || []).length >= g.min)
}

export function buildModifier(group: any, opt: any) {
  return {
    groupId: group.id,
    optionId: opt.id,
    name: opt.name,
    priceCents: opt.priceCents,
  }
}