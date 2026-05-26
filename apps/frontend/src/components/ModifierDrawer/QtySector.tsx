import { Box, Typography, IconButton } from "@mui/material"

export default function QtySector({ qty, setQty }: any) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="h6" sx={{ color: "text.secondary" }}>
        Qty
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          onClick={() => setQty((q: number) => Math.max(1, q - 1))}
          size="small"
          sx={{
            width: 28,
            height: 28,
            border: "0.5px solid rgba(240,235,227,0.12)",
            borderRadius: "2px",
          }}
        >
          −
        </IconButton>

        <Typography sx={{ minWidth: 24, textAlign: "center" }}>
          {qty}
        </Typography>

        <IconButton
          onClick={() => setQty((q: number) => q + 1)}
          size="small"
          sx={{
            width: 28,
            height: 28,
            border: "0.5px solid rgba(240,235,227,0.12)",
            borderRadius: "2px",
          }}
        >
          +
        </IconButton>
      </Box>
    </Box>
  )
}