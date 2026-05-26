import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface Props {
  item: any
  index: number
  onRemove: (id: string) => void
  onUpdateQty: (id: string, qty: number) => void
}

export default function CartItemRow({
  item,
  index,
  onRemove,
  onUpdateQty,
}: Props) {
  const theme = useTheme()

  const productName =
    typeof item.productId === "object"
      ? item.productId.name
      : "Unknown product"

  return (
    <Box
      sx={{
        p: 3,
        border: `0.5px solid ${theme.palette.divider}`,
        borderBottom: index === 0 ? undefined : "none",
        display: "flex",
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      {/* LEFT */}
      <Box sx={{ flex: 1 }}>
        {/* NAME */}
        <Typography sx={{ fontSize: "1rem", mb: 1 }}>
          {productName}
        </Typography>

        {/* MODIFIERS */}
        {item.selectedModifiers?.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, display: "block", mb: 1 }}
          >
            {item.selectedModifiers.map((m: any) => m.name).join(", ")}
          </Typography>
        )}

        {/* PRICE */}
        <Typography
          sx={{
            fontStyle: "italic",
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          ${(item.totalPriceCents / 100).toFixed(2)}
        </Typography>

        {/* FOOT CONTROLS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* QTY */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onUpdateQty(item._id, item.quantity - 1)}
              sx={{
                width: 24,
                height: 24,
                border: `0.5px solid ${theme.palette.divider}`,
                borderRadius: "2px",
              }}
            >
              −
            </IconButton>

            <Typography sx={{ minWidth: 20, textAlign: "center" }}>
              {item.quantity}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onUpdateQty(item._id, item.quantity + 1)}
              sx={{
                width: 24,
                height: 24,
                border: `0.5px solid ${theme.palette.divider}`,
                borderRadius: "2px",
              }}
            >
              +
            </IconButton>
          </Box>

          {/* DELETE */}
          <Tooltip title="Remove">
            <IconButton
              onClick={() => onRemove(item._id)}
              size="small"
              sx={{
                color: theme.palette.text.disabled,
                "&:hover": {
                  color: "#C0392B",
                  background: "transparent",
                },
              }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}