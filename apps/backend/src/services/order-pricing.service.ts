export const calculateOrderPricing = (
  subtotalCents: number
) => {
  const taxPercent =
    Number(process.env.TAX_PERCENT) || 10

  const serviceFeePercent =
    Number(process.env.SERVICE_FEE_PERCENT) || 5

  const taxCents = Math.round(
    subtotalCents * (taxPercent / 100)
  )

  const serviceFeeCents = Math.round(
    subtotalCents *
    (serviceFeePercent / 100)
  )

  const totalCents =
    subtotalCents +
    taxCents +
    serviceFeeCents

  return {
    subtotalCents,
    taxCents,
    serviceFeeCents,
    totalCents
  }
}