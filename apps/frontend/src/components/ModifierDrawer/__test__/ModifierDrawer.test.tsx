import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { vi, describe, it, expect, beforeEach } from "vitest"
import { theme } from "../../../theme/theme"
import ModifierDrawer from "../ModifierDrawer"
import type { Product } from "../../../types/product/product"

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const mockOnClose = vi.fn()
const mockOnAdd = vi.fn()

const baseProduct: Product = {
  _id: "prod-1",
  name: "Smash Burger",
  description: "Double smash patty",
  priceCents: 1500,
  category: "Burgers",
  imageUrl: "",                          // ← campo requerido por el tipo Product
  modifierGroups: [
    {
      id: "group-protein",
      name: "Protein",
      required: true,
      min: 1,
      max: 1,
      options: [
        { id: "opt-beef",    name: "Beef",    priceCents: 0 },
        { id: "opt-chicken", name: "Chicken", priceCents: 0 },
      ],
    },
    {
      id: "group-toppings",
      name: "Toppings",
      required: false,
      min: 0,
      max: 3,
      options: [
        { id: "opt-cheese",  name: "Cheese",  priceCents: 200 },
        { id: "opt-lettuce", name: "Lettuce", priceCents: 0   },
      ],
    },
  ],
}

const renderDrawer = (overrides?: Partial<Parameters<typeof ModifierDrawer>[0]>) =>
  render(
    <Wrapper>
      <ModifierDrawer
        open={true}
        product={baseProduct}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        {...overrides}
      />
    </Wrapper>
  )

describe("ModifierDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks()                   // ← vi, no jest
  })

  it("renders product name and price", () => {
    renderDrawer()
    expect(screen.getByText("Smash Burger")).toBeInTheDocument()
    expect(screen.getByText("$15.00")).toBeInTheDocument()
  })

  it("renders all modifier groups", () => {
    renderDrawer()
    expect(screen.getByText("Protein")).toBeInTheDocument()
    expect(screen.getByText("Toppings")).toBeInTheDocument()
  })

  it("renders modifier options", () => {
    renderDrawer()
    expect(screen.getByText("Beef")).toBeInTheDocument()
    expect(screen.getByText("Chicken")).toBeInTheDocument()
    expect(screen.getByText("Cheese")).toBeInTheDocument()
  })

  it("disables Add button when required group not selected", () => {
    renderDrawer()
    const btn = screen.getByRole("button", { name: /add to cart/i })
    expect(btn).toBeDisabled()
  })

  it("enables Add button after required modifier is selected", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Beef"))
    const btn = screen.getByRole("button", { name: /add to cart/i })
    expect(btn).not.toBeDisabled()
  })

  it("shows +$2.00 label for paid modifier", () => {
    renderDrawer()
    expect(screen.getByText("+$2.00")).toBeInTheDocument()
  })

  it("calls onAdd with product, mods, and qty when submitted", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Beef"))
    fireEvent.click(screen.getByText("Cheese"))
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }))

    expect(mockOnAdd).toHaveBeenCalledWith(
      baseProduct,
      expect.arrayContaining([
        expect.objectContaining({ optionId: "opt-beef"   }),
        expect.objectContaining({ optionId: "opt-cheese" }),
      ]),
      1
    )
  })

  it("increments quantity", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("+"))
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("does not decrement below 1", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("−"))
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("calls onClose when × is clicked", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("×"))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it("renders 'No customizations available' when product has no modifier groups", () => {
    const simpleProduct = { ...baseProduct, modifierGroups: [] }
    renderDrawer({ product: simpleProduct })
    expect(screen.getByText(/no customizations available/i)).toBeInTheDocument()
  })

  it("returns null when product is null", () => {
    const { container } = render(
      <Wrapper>
        <ModifierDrawer open={true} product={null} onClose={mockOnClose} onAdd={mockOnAdd} />
      </Wrapper>
    )
    expect(container.firstChild).toBeNull()
  })

  it("respects max modifier selection per group", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Beef"))
    fireEvent.click(screen.getByText("Chicken"))
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }))

    const mods = mockOnAdd.mock.calls[0][1]
    const proteinMods = mods.filter((m: any) => m.groupId === "group-protein")
    expect(proteinMods).toHaveLength(1)
    expect(proteinMods[0].optionId).toBe("opt-chicken")
  })

  it("updates total price when modifier with priceCents is selected", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Beef"))
    fireEvent.click(screen.getByText("Cheese")) // +$2.00
    expect(screen.getByRole("button", { name: /add to cart.*17\.00/i })).toBeInTheDocument()
  })
})