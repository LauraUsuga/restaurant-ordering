import "@testing-library/jest-dom/vitest" 

const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Warning:")) return
    originalError(...args)
  }
})
afterAll(() => {
  console.error = originalError
})