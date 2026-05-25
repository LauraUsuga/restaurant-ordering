import { Request, Response, NextFunction } from 'express'

export const payloadLimit = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body || {}

  const size = Buffer.byteLength(JSON.stringify(body))

  const limit = 1024 * 1024 // 1MB por ejemplo

  if (size > limit) {
    return res.status(413).json({
      message: 'Payload too large'
    })
  }

  next()
}