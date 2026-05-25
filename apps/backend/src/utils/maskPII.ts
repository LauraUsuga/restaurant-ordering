export const maskPII = (
  text: string
) => {
  return text
    .replace(
      /([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*)(@.*)/g,
      "$1***$3"
    )
    .replace(
      /(\d{3})\d+(\d{3})/g,
      "$1****$2"
    )
}