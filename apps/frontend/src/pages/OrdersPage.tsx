import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  useTheme,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material"
import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { api } from "../services/api"
import type { Order } from "../types/order"

export default function OrdersPage() {
  const theme = useTheme()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [sort, setSort] = useState<"desc" | "asc">("desc")

  const [search, setSearch] = useState("")

  const limit = 5

  /**
   * Load orders from backend
   */
  const loadOrders = async () => {
    const res = await api.get(`/orders/user/mock-user-1`, {
      params: {
        page,
        limit,
        sort,
      },
    })

    setOrders(res.data.orders)
    setTotalPages(res.data.pagination.totalPages)
  }

  useEffect(() => {
    loadOrders()
  }, [page, sort])

  /**
   * Filter (client-side)
   * - order number (id)
   * - product name (if exists in items)
   */
  const filteredOrders = useMemo(() => {
    if (!search) return orders

    return orders.filter((order) => {
      const orderMatch = order._id
        .toLowerCase()
        .includes(search.toLowerCase())

      const productMatch = order.items?.some((item: any) =>
        item.productName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )

      return orderMatch || productMatch
    })
  }, [orders, search])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "PREPARING":
        return "info"
      case "SENT":
        return "secondary"
      case "DELIVERED":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <Layout>
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: 6,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* HEADER */}
        <Typography variant="h3" sx={{ mb: 1 }}>
          My orders
        </Typography>

        <Typography
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
          }}
        >
          Review your order history and track live status
        </Typography>

        {/* CONTROLS */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            label="Search order / product"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />

          <TextField
            select
            size="small"
            label="Sort"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as any)
            }
          >
            <MenuItem value="desc">
              Newest first
            </MenuItem>
            <MenuItem value="asc">
              Oldest first
            </MenuItem>
          </TextField>
        </Box>

        {/* LIST */}
        {!filteredOrders.length ? (
          <Typography>No orders found</Typography>
        ) : (
          <Stack spacing={2}>
            {filteredOrders.map((order) => (
              <Card
                key={order._id}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        Order #{order._id.slice(-6)}
                      </Typography>

                      <Typography variant="caption">
                        {new Date(
                          order.createdAt ?? ""
                        ).toLocaleString()}
                      </Typography>
                    </Box>

                    <Chip
                      label={order.status}
                      color={
                        getStatusColor(
                          order.status
                        ) as any
                      }
                    />
                  </Box>

                  <Typography sx={{ mb: 2 }}>
                    Total: $
                    {(order.totalCents / 100).toFixed(2)}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/orders/${order._id}`)
                    }
                  >
                    Track order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* PAGINATION */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      </Box>
    </Layout>
  )
}