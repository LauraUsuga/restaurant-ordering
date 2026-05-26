import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"

import { theme } from "../../theme/theme"
import OrderTrackPage from "../OrderTrackPage"
import { api } from "../../services/api"

vi.mock("../../services/api", () => ({
  api: {
    get: vi.fn(),
  },
}))

const mockGet = vi.mocked(api.get)

const mockOrder = {
  _id: "order-1",
  status: "PREPARING",
  totalCents: 5650,
  items: [],
}

const mockTimeline = [
  {
    eventId: "e1",
    type: "ORDER_PLACED",
    timestamp: "2025-01-01T10:00:00.000Z",
    source: "web",
    correlationId: "corr-1",
    payload: {
      status: "PENDING",
      totalCents: 5650,
    },
  },
  {
    eventId: "e2",
    type: "ORDER_STATUS_CHANGED",
    timestamp: "2025-01-01T10:00:05.000Z",
    source: "worker",
    correlationId: "corr-1",
    payload: {
      from: "PENDING",
      to: "PREPARING",
    },
  },
]

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={["/orders/order-1"]}>
        <Routes>
          <Route path="/orders/:orderId" element={<OrderTrackPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )

describe("OrderTrackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGet.mockImplementation((url: string) => {
      if (url.includes("/timeline")) {
        return Promise.resolve({
          data: { events: mockTimeline },
        })
      }

      return Promise.resolve({
        data: mockOrder,
      })
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  it("shows loading spinner on initial render", () => {
    mockGet.mockReturnValue(new Promise(() => { }))

    renderPage()

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("renders order status after load", async () => {
    renderPage()

    expect(await screen.findByText("PREPARING")).toBeInTheDocument()
  })

  it("renders timeline event types", async () => {
    renderPage()

    expect(await screen.findByText("ORDER_PLACED")).toBeInTheDocument()
    expect(await screen.findByText("ORDER_STATUS_CHANGED")).toBeInTheDocument()
  })

  it("event payload is hidden by default", async () => {
    renderPage()

    await screen.findByText("ORDER_PLACED")

    expect(screen.queryByText(/from: PENDING/i)).not.toBeInTheDocument()
  })

  it("expands event on click", async () => {
    renderPage()

    const event = await screen.findByText("ORDER_STATUS_CHANGED")

    fireEvent.click(event)

    expect(await screen.findByText(/from: PENDING/i)).toBeInTheDocument()
  })

  it("collapses event on second click", async () => {
    renderPage()

    const event = await screen.findByText("ORDER_STATUS_CHANGED")

    fireEvent.click(event)

    expect(await screen.findByText(/from: PENDING/i)).toBeInTheDocument()

    fireEvent.click(event)

    await waitFor(() => {
      expect(screen.queryByText(/from: PENDING/i)).not.toBeInTheDocument()
    })
  })

  it("shows correlationId and source", async () => {
    renderPage()

    const event = await screen.findByText("ORDER_PLACED")

    fireEvent.click(event)

    expect(await screen.findByText(/corr-1/i)).toBeInTheDocument()
    expect(screen.getByText(/web/i)).toBeInTheDocument()
  })

  it("polls every 4 seconds", async () => {
    renderPage()

    await screen.findByText("ORDER_PLACED")

    const callsBefore = mockGet.mock.calls.length

    await waitFor(
      () => {
        expect(mockGet.mock.calls.length).toBeGreaterThan(callsBefore)
      },
      { timeout: 6000 }
    )
  })

  it("shows error state on failed load", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"))

    renderPage()

    expect(
      await screen.findByText(/failed to load order tracking/i)
    ).toBeInTheDocument()
  })

  it("shows Waiting for updates when timeline is empty", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.includes("/timeline")) {
        return Promise.resolve({ data: { events: [] } })
      }

      return Promise.resolve({ data: mockOrder })
    })

    renderPage()

    expect(
      await screen.findByText(/waiting for updates/i)
    ).toBeInTheDocument()
  })
})