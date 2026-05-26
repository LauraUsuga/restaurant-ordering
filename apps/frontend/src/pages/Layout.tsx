import { Box, Button, Typography, useTheme } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
  cartCount?: number
}

/**
 * App Layout
 * - Header navigation
 * - Main content
 * - Footer
 *
 * Navigation uses Buttons for consistency and accessibility
 */
export default function Layout({
  children,
  cartCount = 0,
}: LayoutProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) =>
    location.pathname === path

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.default,
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          px: { xs: 3, md: 6 },
          py: 2.5,

          borderBottom: `0.5px solid ${theme.palette.divider}`,
          background: "rgba(14,13,11,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "baseline",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: "1.4rem" }}>
            fork
          </Typography>

          <Typography
            sx={{
              fontSize: "1.4rem",
              fontStyle: "italic",
              color: theme.palette.primary.main,
            }}
          >
            &
          </Typography>

          <Typography sx={{ fontSize: "1.4rem" }}>
            fire
          </Typography>
        </Box>

        {/* NAVIGATION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* MENU */}
          <Button
            onClick={() => navigate("/")}
            variant={isActive("/") ? "contained" : "text"}
            size="small"
          >
            Menu
          </Button>

          {/* CART */}
          <Button
            onClick={() => navigate("/cart")}
            variant={isActive("/cart") ? "contained" : "text"}
            size="small"
            endIcon={
              cartCount > 0 ? (
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#0E0D0B",
                    background: theme.palette.primary.main,
                  }}
                >
                  {cartCount}
                </Box>
              ) : undefined
            }
          >
            Cart
          </Button>

          {/* ORDERS */}
          <Button
            onClick={() => navigate("/orders")}
            variant={isActive("/orders") ? "contained" : "text"}
            size="small"
          >
            Orders
          </Button>
        </Box>
      </Box>

      {/* ================= MAIN ================= */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* ================= FOOTER ================= */}
      <Box
        component="footer"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          px: { xs: 3, md: 6 },
          py: 3,

          borderTop: `0.5px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.disabled }}
        >
          fork & fire — kitchen open
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.disabled }}
        >
          by Laura Usuga Quiñones
        </Typography>
      </Box>
    </Box>
  )
}