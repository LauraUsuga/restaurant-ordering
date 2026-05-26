import {
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import { useModifiers } from "../../hooks/useModifiers"
import { isModifierSelected } from "../../utils/modifiers"
import type { ModifierGroup, ModifierOption } from "../../types/product/modifiers"

export default function ModifierDrawer({
  open,
  product,
  onClose,
  onAdd,
}: any) {
  const theme = useTheme()

  if (!product) return null

  const {
    selected,
    setSelected,
    qty,
    setQty,
    totalCents,
    valid,
  } = useModifiers(product)

  const toggleMod = (group: ModifierGroup, opt: ModifierOption) => {
    const gid = group.id
    const current = selected[gid] || []

    const exists = current.find((m) => m.optionId === opt.id)

    if (exists) {
      setSelected((s) => ({
        ...s,
        [gid]: current.filter((m) => m.optionId !== opt.id),
      }))
    } else {
      if (current.length >= group.max) {
        setSelected((s) => ({
          ...s,
          [gid]: [
            ...current.slice(1),
            {
              groupId: gid,
              optionId: opt.id,
              name: opt.name,
              priceCents: opt.priceCents,
            },
          ],
        }))
      } else {
        setSelected((s) => ({
          ...s,
          [gid]: [
            ...current,
            {
              groupId: gid,
              optionId: opt.id,
              name: opt.name,
              priceCents: opt.priceCents,
            },
          ],
        }))
      }
    }
  }

  const handleAdd = () => {
    const allMods = Object.values(selected).flat()
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
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

        {/* HEADER */}
        <Box
          sx={{
            p: 3,
            borderBottom: `0.5px solid ${theme.palette.divider}`,
            position: "relative",
          }}
        >
          {/* X BUTTON */}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              border: `0.5px solid ${theme.palette.divider}`,
              borderRadius: "2px",
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography variant="h5">{product.name}</Typography>
          <Typography variant="body2">{product.description}</Typography>

          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>
            ${(product.priceCents / 100).toFixed(2)}
          </Typography>
        </Box>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {product.modifierGroups?.map((group: ModifierGroup) => (
            <Box key={group.id} sx={{ mb: 3 }}>
              <Typography variant="h6">{group.name}</Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {group.options.map((opt) => {
                  const sel = isModifierSelected(selected, group.id, opt.id)

                  return (
                    <Box
                      key={opt.id}
                      onClick={() => toggleMod(group, opt)}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: "pointer",
                        border: `0.5px solid ${
                          sel ? theme.palette.primary.main : theme.palette.divider
                        }`,
                      }}
                    >
                      {opt.name}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* FOOTER */}
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!valid}
            onClick={handleAdd}
          >
            Add — ${(totalCents / 100).toFixed(2)}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}