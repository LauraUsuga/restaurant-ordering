import { Box, useTheme } from "@mui/material"
import type { ReactNode } from "react"
import AppHeader from "./AppHeader"
import AppFooter from "./AppFooter"

interface LayoutProps {
  children: ReactNode
  cartCount?: number
}

export default function Layout({
  children,
  cartCount = 0,
}: LayoutProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.default,
      }}
    >
      <AppHeader cartCount={cartCount} />

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <AppFooter />
    </Box>
  )
}