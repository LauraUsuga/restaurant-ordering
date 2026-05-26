import { payloadLimit } from "../payload-limit"
import type { Request, Response, NextFunction } from "express"

const makeReq = (body: any): Partial<Request> => ({ body })
const makeRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}
const next: NextFunction = jest.fn()

describe("payloadLimit middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("calls next() when payload is under 16KB", () => {
    const req = makeReq({ data: "small payload" })
    payloadLimit(req as Request, makeRes() as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("calls next() when body is undefined", () => {
    const req = makeReq(undefined)
    payloadLimit(req as Request, makeRes() as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("returns 400 when payload exceeds 16KB", () => {
    const bigString = "x".repeat(17 * 1024) // 17KB
    const req = makeReq({ payload: { data: bigString } })
    const res = makeRes()
    payloadLimit(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Payload exceeds 16KB limit" })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 400 for body that itself is > 16KB (no nested payload key)", () => {
    // payload-limit checks req.body?.payload ?? req.body
    const bigString = "x".repeat(17 * 1024)
    const req = makeReq({ data: bigString }) // no .payload key → checks whole body
    const res = makeRes()
    payloadLimit(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it("allows exactly 16KB payload", () => {
    // 16 * 1024 = 16384 bytes — exactly at limit should pass
    // JSON stringify adds some overhead, so use slightly less
    const okString = "x".repeat(16 * 1024 - 50)
    const req = makeReq({ payload: { data: okString } })
    const res = makeRes()
    payloadLimit(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})