import { Typography, Box, useTheme } from "@mui/material"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import SyncIcon from "@mui/icons-material/Sync"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import EditIcon from "@mui/icons-material/Edit"
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import type { SvgIconComponent } from "@mui/icons-material"
import type { TimelineEvent } from "../../types/timeline/timeline"

interface Props {
  event: TimelineEvent
  expanded: boolean
  onToggle: () => void
  isLast?: boolean
}

const EVENT_ICONS: Record<string, SvgIconComponent> = {
  ORDER_PLACED: ReceiptLongIcon,
  ORDER_STATUS_CHANGED: SyncIcon,
  CART_ITEM_ADDED: AddShoppingCartIcon,
  CART_ITEM_UPDATED: EditIcon,
  CART_ITEM_REMOVED: RemoveShoppingCartIcon,
  PRICING_CALCULATED: PriceCheckIcon,
  VALIDATION_FAILED: WarningAmberIcon,
}

const EVENT_COLORS: Record<string, string> = {
  ORDER_PLACED: "#D4A373",
  ORDER_STATUS_CHANGED: "#8E6C88",
  CART_ITEM_ADDED: "#5DCAA5",
  CART_ITEM_UPDATED: "#85B7EB",
  CART_ITEM_REMOVED: "#C0392B",
  PRICING_CALCULATED: "#D4A373",
  VALIDATION_FAILED: "#EF9F27",
}

// Keys that are monetary cents — format them as dollars instead of raw numbers
const CENTS_KEYS = ["subtotalCents", "taxCents", "serviceFeeCents", "totalCents", "totalPriceCents", "basePriceCents"]

const formatPayloadValue = (key: string, value: unknown): string => {
  if (CENTS_KEYS.includes(key) && typeof value === "number") {
    return `$${(value / 100).toFixed(2)}`
  }
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// Make keys more readable: "subtotalCents" → "Subtotal"
const formatPayloadKey = (key: string): string =>
  key
    .replace(/Cents$/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()

export default function TimelineItem({ event, expanded, onToggle, isLast = false }: Props) {
  const theme = useTheme()

  const Icon = EVENT_ICONS[event.type] ?? ReceiptLongIcon
  const color = EVENT_COLORS[event.type] ?? theme.palette.primary.main

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    })

  return (
    <Box sx={{ display: "flex", gap: 2 }}>

      {/* LEFT: dot + connector */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `${color}22`,
            border: `1.5px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Icon sx={{ fontSize: 18, color }} />
        </Box>

        {!isLast && (
          <Box sx={{ width: "1.5px", flex: 1, minHeight: 24, background: `${color}44`, mt: 0.5 }} />
        )}
      </Box>

      {/* RIGHT: content */}
      <Box sx={{ flex: 1, mb: isLast ? 0 : 2 }}>

        {/* Header */}
        <Box
          onClick={onToggle}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            cursor: "pointer",
            p: 1.5,
            border: `0.5px solid ${theme.palette.divider}`,
            borderRadius: expanded ? "4px 4px 0 0" : "4px",
            background: expanded ? `${color}08` : "transparent",
            transition: "background 0.15s",
            "&:hover": { background: `${color}10` },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color }}>
              {event.type}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {formatDate(event.timestamp)}
            </Typography>
          </Box>

          {expanded
            ? <ExpandLessIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.25 }} />
            : <ExpandMoreIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.25 }} />
          }
        </Box>

        {/* Expanded */}
        {expanded && (
          <Box
            sx={{
              p: 1.5,
              border: `0.5px solid ${theme.palette.divider}`,
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", mb: 1 }}>
              source: <strong>{event.source}</strong>
              &nbsp;·&nbsp;
              correlationId: <strong>{event.correlationId}</strong>
            </Typography>

            {event.payload && Object.keys(event.payload).length > 0 && (
              <Box sx={{ p: 1, borderRadius: "2px", background: "rgba(0,0,0,0.2)" }}>
                {Object.entries(event.payload).map(([key, value]) => (
                  <Typography key={key} variant="caption" sx={{ display: "block", lineHeight: 1.8, fontFamily: "monospace" }}>
                    <span style={{ color: theme.palette.primary.main }}>
                      {formatPayloadKey(key)}
                    </span>
                    <span style={{ color: theme.palette.text.secondary }}>: </span>
                    <span style={{ color: theme.palette.text.primary }}>
                      {formatPayloadValue(key, value)}
                    </span>
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}