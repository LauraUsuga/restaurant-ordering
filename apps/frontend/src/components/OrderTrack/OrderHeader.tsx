import { Typography, Box, useTheme } from "@mui/material"

export default function OrderHeader() {
  const theme = useTheme()

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        Order tracking 
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        Live updates of your order status
      </Typography>
    </Box>
  )
}