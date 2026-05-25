import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack
} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import type { Product } from "../types/product"

export default function MenuPage() {
  const [products, setProducts] =
    useState<Product[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const loadProducts = async () => {
      const response =
        await api.get("/menu")

      setProducts(response.data)
    }

    loadProducts()
  }, [])

  const addToCart = async (
    product: Product
  ) => {
    await api.post("/cart/items", {
      userId: "mock-user-1",
      productId: product._id,
      quantity: 1,
      selectedModifiers: [],
      correlationId: crypto.randomUUID()
    })

    alert("Added to cart")
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">
          Restaurant Menu
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate("/cart")
          }
        >
          Go to Cart
        </Button>

        {products.map((product) => (
          <Card key={product._id}>
            <CardContent>
              <Typography variant="h6">
                {product.name}
              </Typography>

              <Typography>
                {product.description}
              </Typography>

              <Typography>
                $
                {(
                  product.priceCents /
                  100
                ).toFixed(2)}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() =>
                  addToCart(product)
                }
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}