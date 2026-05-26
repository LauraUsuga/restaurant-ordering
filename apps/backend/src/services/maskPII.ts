const PII_KEYS = [
  "email",
  "phone",
  "phonenumber",
  "cel",
]

export const maskPII = (
  payload: Record<string, unknown>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(payload)) {
    if (
      PII_KEYS.includes(key.toLowerCase()) &&
      typeof value === "string"
    ) {
      result[key] = value.replace(/.(?=.{4})/g, "*")
    } else {
      result[key] = value
    }
  }

  return result
}