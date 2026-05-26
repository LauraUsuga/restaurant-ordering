import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Drawer,
  Stack,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

interface Props {
  cartCount?: number
}

export default function AppHeader({ cartCount = 0 }: Props) {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const isActive = (path: string) =>
    location.pathname === path

  const go = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const navItems = [
    { label: "Menu", path: "/" },
    { label: "Cart", path: "/cart", badge: cartCount },
    { label: "Orders", path: "/orders" },
  ]

  return (
    <>
      {/* HEADER */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 2,
          borderBottom: `0.5px solid ${theme.palette.divider}`,
          background: "rgba(14,13,11,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* LOGO */}
        <Box
          onClick={() => navigate("/")}
          sx={{ display: "flex", cursor: "pointer", gap: 0.5 }}
        >
          <Typography>fork</Typography>
          <Typography sx={{ color: theme.palette.primary.main }}>
            &
          </Typography>
          <Typography>fire</Typography>
        </Box>

        {/* DESKTOP NAV */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={isActive(item.path) ? "contained" : "text"}
              size="small"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* MOBILE MENU BUTTON */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ width: 250, p: 2 }} spacing={2}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => go(item.path)}
              variant={isActive(item.path) ? "contained" : "text"}
              fullWidth
            >
              {item.label}
              {item.badge ? ` (${item.badge})` : ""}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </>
  )
}