import {
  Request,
  Response,
  NextFunction
} from "express"

export const payloadLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload =
    req.body?.payload ?? req.body

  // no body → continue
  if (!payload) {
    return next()
  }

  const serialized =
    JSON.stringify(payload)

  const size = Buffer.byteLength(
    serialized,
    "utf8"
  )

  const LIMIT = 16 * 1024

  if (size > LIMIT) {
    return res.status(400).json({
      error: "Payload exceeds 16KB limit"
    })
  }

  next()
}