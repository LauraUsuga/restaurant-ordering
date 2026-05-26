import { Box, Typography, IconButton } from "@mui/material"

interface Props {
  qty: number
  setQty: React.Dispatch<React.SetStateAction<number>>
}

export default function QtySector({ qty, setQty }: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

      {/* LABEL */}
      <Typography variant="h6" sx={{ color: "text.secondary" }}>
        Qty
      </Typography>

      {/* CONTROLS */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

        {/* DECREMENT */}
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

        {/* VALUE */}
        <Typography sx={{ minWidth: 24, textAlign: "center" }}>
          {qty}
        </Typography>

        {/* INCREMENT */}
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