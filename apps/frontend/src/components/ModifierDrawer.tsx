import {
  Box,
  Typography,
  Chip,
  Button,
  Drawer,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import type { Product } from "../types/product/product";
import type { ModifierGroup, ModifierOption } from "../types/product/modifiers";

interface SelectedMod {
  groupId: string
  optionId: string
  name: string
  priceCents: number
}

interface ModifierDrawerProps {
  open: boolean
  product: Product | null
  onClose: () => void
  onAdd: (product: Product, mods: SelectedMod[], qty: number) => void
}

export default function ModifierDrawer({ open, product, onClose, onAdd }: ModifierDrawerProps) {
  const theme = useTheme()
  const [selected, setSelected] = useState<Record<string, SelectedMod[]>>({})
  const [qty, setQty] = useState(1)

  if (!product) return null

  const toggleMod = (group: ModifierGroup, opt: ModifierOption) => {
    const gid = group.id
    const current = selected[gid] || []
    const exists = current.find((m) => m.optionId === opt.id)

    if (exists) {
      setSelected((s) => ({ ...s, [gid]: current.filter((m) => m.optionId !== opt.id) }))
    } else {
      if (current.length >= group.max) {
        setSelected((s) => ({
          ...s,
          [gid]: [...current.slice(1), { groupId: gid, optionId: opt.id, name: opt.name, priceCents: opt.priceCents }],
        }))
      } else {
        setSelected((s) => ({
          ...s,
          [gid]: [...current, { groupId: gid, optionId: opt.id, name: opt.name, priceCents: opt.priceCents }],
        }))
      }
    }
  }

  const isSelected = (groupId: string, optId: string) =>
    (selected[groupId] || []).some((m) => m.optionId === optId)

  const meetsRequirements = () => {
    if (!product.modifierGroups) return true
    return product.modifierGroups
      .filter((g) => g.required)
      .every((g) => (selected[g.id] || []).length >= g.min)
  }

  const allMods = Object.values(selected).flat()
  const extraCents = allMods.reduce((a, m) => a + m.priceCents, 0)
  const totalCents = (product.priceCents + extraCents) * qty

  const handleAdd = () => {
    onAdd(product, allMods, qty)
    setSelected({})
    setQty(1)
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
          },
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 3, borderBottom: `0.5px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5, fontSize: "1.4rem" }}>
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {product.description}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                border: `0.5px solid ${theme.palette.divider}`,
                borderRadius: "2px",
                ml: 2,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1, padding: "0 2px" }}>×</span>
            </IconButton>
          </Box>
          <Typography
            variant="h5"
            sx={{ mt: 2, fontSize: "1.6rem", color: theme.palette.primary.main, fontStyle: "italic" }}
          >
            ${(product.priceCents / 100).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {product.modifierGroups && product.modifierGroups.length > 0 ? (
            product.modifierGroups.map((group, i) => (
              <Box key={group.id} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                    {group.name}
                  </Typography>
                  <Chip
                    label={group.required ? "required" : `up to ${group.max}`}
                    size="small"
                    sx={{
                      background: group.required
                        ? "rgba(232,160,69,0.12)"
                        : "rgba(240,235,227,0.05)",
                      color: group.required ? theme.palette.primary.main : theme.palette.text.secondary,
                      border: `0.5px solid ${group.required ? "rgba(232,160,69,0.3)" : theme.palette.divider}`,
                      fontSize: "0.65rem",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {group.options.map((opt) => {
                    const sel = isSelected(group.id, opt.id)
                    return (
                      <Box
                        key={opt.id}
                        onClick={() => toggleMod(group, opt)}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          border: `0.5px solid ${sel ? theme.palette.primary.main : "rgba(240,235,227,0.12)"}`,
                          background: sel ? "rgba(232,160,69,0.08)" : "transparent",
                          borderRadius: "2px",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          "&:hover": {
                            borderColor: sel ? theme.palette.primary.light : "rgba(240,235,227,0.25)",
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ color: sel ? theme.palette.primary.light : theme.palette.text.primary, fontSize: "0.82rem" }}>
                          {opt.name}
                        </Typography>
                        {opt.priceCents > 0 && (
                          <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                            +${(opt.priceCents / 100).toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
                {i < (product.modifierGroups?.length ?? 0) - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))
          ) : (
            <Box sx={{
              py: 4,
              textAlign: "center",
              border: `0.5px solid ${theme.palette.divider}`,
              borderRadius: "2px",
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: "italic" }}>
                No customizations available
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3, borderTop: `0.5px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              Qty
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  border: `0.5px solid ${theme.palette.divider}`,
                  borderRadius: "2px",
                  color: theme.palette.text.secondary,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>−</span>
              </IconButton>
              <Typography sx={{ fontWeight: 500, minWidth: 24, textAlign: "center" }}>
                {qty}
              </Typography>
              <IconButton
                onClick={() => setQty((q) => q + 1)}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  border: `0.5px solid ${theme.palette.divider}`,
                  borderRadius: "2px",
                  color: theme.palette.text.secondary,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              </IconButton>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!meetsRequirements()}
            onClick={handleAdd}
            sx={{ py: 1.5 }}
          >
            Add to cart — ${(totalCents / 100).toFixed(2)}
          </Button>

          {!meetsRequirements() && (
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: "block", mt: 1, textAlign: "center" }}>
              Select required options to continue
            </Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}