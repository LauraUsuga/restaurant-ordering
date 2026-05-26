import { Box, Typography, Chip, useTheme } from "@mui/material"

interface Props {
  product: any
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  onClick: () => void
}

export default function ProductCard({
  product,
  hoveredId,
  setHoveredId,
  onClick,
}: Props) {
  const theme = useTheme()

  return (
    <Box
      onMouseEnter={() => setHoveredId(product._id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={onClick}
      sx={{
        p: 3,
        border: `0.5px solid ${theme.palette.divider}`,
        cursor: "pointer",
        transition: "all 0.2s",
        background:
          hoveredId === product._id
            ? "rgba(232,160,69,0.03)"
            : "transparent",
        display: "flex",
        flexDirection: "column",
        minHeight: 340,
      }}
    >

      {/* IMAGE */}
      <Box
        sx={{
          height: 140,
          mb: 2,
          overflow: "hidden",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box sx={{ opacity: 0.4, fontSize: 12 }}>no image</Box>
        )}
      </Box>

      {/* CATEGORY */}
      {product.category && (
        <Chip
          label={product.category}
          size="small"
          sx={{
            mb: 1,
            alignSelf: "flex-start",
            background: "rgba(232,160,69,0.12)",
            color: theme.palette.primary.main,
            border: `0.5px solid rgba(232,160,69,0.3)`,
          }}
        />
      )}

      {/* NAME */}
      <Typography variant="h5" sx={{ fontSize: "1.1rem", mb: 1 }}>
        {product.name}
      </Typography>

      {/* DESCRIPTION */}
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, mb: 2 }}
      >
        {product.description}
      </Typography>

      {/* PRICE */}
      <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: "1.3rem",
            color: theme.palette.primary.main,
            fontStyle: "italic",
          }}
        >
          ${(product.priceCents / 100).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  )
}