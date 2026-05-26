import { Box, Typography, useTheme } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import NavItem from "../components/NavItem";

interface LayoutProps {
  children: ReactNode
  cartCount?: number
}

export default function Layout({ children, cartCount = 0 }: LayoutProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Box sx={{
      minHeight: "100vh",
      background: theme.palette.background.default,
      display: "flex",
      flexDirection: "column",
    }}>
      <Box
        component="header"
        sx={{
          borderBottom: `0.5px solid ${theme.palette.divider}`,
          px: { xs: 3, md: 6 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(14,13,11,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Box
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 0.5 }}
        >
          <Typography variant="h4" sx={{ fontSize: "1.4rem", color: theme.palette.text.primary }}>
            fork
          </Typography>
          <Typography variant="h4" sx={{ fontSize: "1.4rem", color: theme.palette.primary.main, fontStyle: "italic" }}>
            &
          </Typography>
          <Typography variant="h4" sx={{ fontSize: "1.4rem", color: theme.palette.text.primary }}>
            fire
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NavItem
            label="Menu"
            active={isActive("/")}
            onClick={() => navigate("/")}
          />
          <Box
            onClick={() => navigate("/cart")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              cursor: "pointer",
              border: `0.5px solid ${isActive("/cart") ? theme.palette.primary.main : "rgba(240,235,227,0.15)"}`,
              borderRadius: "2px",
              transition: "all 0.2s",
              "&:hover": { borderColor: theme.palette.primary.main },
            }}
          >
            <Typography variant="caption" sx={{
              color: isActive("/cart") ? theme.palette.primary.main : theme.palette.text.secondary,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              fontWeight: 500,
            }}>
              Cart
            </Typography>
            {cartCount > 0 && (
              <Box sx={{
                background: theme.palette.primary.main,
                color: "#0E0D0B",
                borderRadius: "50%",
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}>
                {cartCount}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: `0.5px solid ${theme.palette.divider}`,
          px: { xs: 3, md: 6 },
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
          fork & fire — kitchen open
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
          by Laura Usuga Quiñones
        </Typography>
      </Box>
    </Box>
  )
}