import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material"
import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout/Layout"
import { api } from "../services/api"
import type { Order } from "../types/order/order"

import OrdersHeader from "../components/Orders/OrdersHeader"
import OrdersControls from "../components/Orders/OrdersControls"
import OrderCard from "../components/Orders/OrderCard"

export default function OrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState<"desc" | "asc">("desc")
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const limit = 5

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get(`/orders/user/mock-user-1`, {
        params: { page, limit, sort },
      })

      setOrders(res.data.orders)
      setTotalPages(res.data.pagination.totalPages)
    } catch {
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, sort])

  const filteredOrders = useMemo(() => {
    if (!search) return orders

    return orders.filter((order) => {
      const orderMatch = order._id
        .toLowerCase()
        .includes(search.toLowerCase())

      const productMatch = order.items?.some((item: any) =>
        item.productName?.toLowerCase().includes(search.toLowerCase())
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
      <Box sx={{ px: { xs: 3, md: 6 }, py: 6, maxWidth: 900, mx: "auto" }}>

        <OrdersHeader />

        <OrdersControls
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {!filteredOrders.length ? (
              <Typography>No orders found</Typography>
            ) : (
              <Stack spacing={2}>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onTrack={() => navigate(`/orders/${order._id}`)}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </Stack>
            )}
          </>
        )}

        {!loading && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}
      </Box>
    </Layout>
  )
}