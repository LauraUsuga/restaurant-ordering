import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"
import { api } from "../services/api"
import { useNavigate } from "react-router-dom"

type CartItem = {
  _id: string
  productId: string
  quantity: number
  totalPriceCents: number
}

type Pricing = {
  subtotalCents: number
  taxCents: number
  serviceFeeCents: number
  totalCents: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [pricing, setPricing] = useState<Pricing | null>(null)

  const navigate = useNavigate()

  const loadCart = async () => {
    const res = await api.get("/cart/mock-user-1")

    setItems(res.data.items)
    setPricing(res.data.pricing)
  }

  useEffect(() => {
    loadCart()
  }, [])

  const removeItem = async (id: string) => {
    await api.delete(`/cart/items/${id}`)
    await loadCart()
  }

  const checkout = async () => {
    const res = await api.post(
      "/orders",
      {
        userId: "mock-user-1",
        correlationId: crypto.randomUUID()
      },
      {
        headers: {
          "Idempotency-Key": crypto.randomUUID()
        }
      }
    )

    navigate(`/orders/${res.data.orderId}`)
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">
        Cart
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {items.map((item) => (
          <Card key={item._id}>
            <CardContent>
              <Typography>
                Product: {item.productId}
              </Typography>

              <Typography>
                Qty: {item.quantity}
              </Typography>

              <Typography>
                ${(item.totalPriceCents / 100).toFixed(2)}
              </Typography>

              <Button
                color="error"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {pricing && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography>
              Subtotal: ${(pricing.subtotalCents / 100).toFixed(2)}
            </Typography>

            <Typography>
              Tax: ${(pricing.taxCents / 100).toFixed(2)}
            </Typography>

            <Typography>
              Service: ${(pricing.serviceFeeCents / 100).toFixed(2)}
            </Typography>

            <Typography variant="h6">
              Total: ${(pricing.totalCents / 100).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={checkout}
        disabled={!items.length}
      >
        Checkout
      </Button>
    </Container>
  )
}