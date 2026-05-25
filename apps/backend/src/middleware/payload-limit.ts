import { Request, Response, NextFunction } from "express"

export const payloadLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const size = Buffer.byteLength(
    JSON.stringify(req.body)
  )

  if (size > 16384) {
    return res.status(400).json({
      error: "Payload exceeds 16KB"
    })
  }

  next()
}