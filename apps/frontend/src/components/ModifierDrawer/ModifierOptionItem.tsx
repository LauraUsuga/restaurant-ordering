import { Box, Typography } from "@mui/material"
import { isModifierSelected } from "../../utils/modifiers"

interface Props {
  option: any
  group: any
  selected: Record<string, any[]>
  onToggle: (group: any, option: any) => void
}

export default function ModifierOptionItem({
  option,
  group,
  selected,
  onToggle,
}: Props) {
  const sel = isModifierSelected(selected, group.id, option.id)

  return (
    <Box
      onClick={() => onToggle(group, option)}
      sx={{
        px: 2,
        py: 1,
        cursor: "pointer",
        border: `0.5px solid ${
          sel ? "primary.main" : "rgba(240,235,227,0.12)"
        }`,
        background: sel ? "rgba(232,160,69,0.08)" : "transparent",
        borderRadius: "2px",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 1,
        "&:hover": {
          borderColor: sel
            ? "primary.light"
            : "rgba(240,235,227,0.25)",
        },
      }}
    >
      {/* OPTION NAME */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.82rem",
          color: sel ? "primary.light" : "text.primary",
        }}
      >
        {option.name}
      </Typography>

      {/* EXTRA PRICE */}
      {option.priceCents > 0 && (
        <Typography variant="caption" sx={{ color: "primary.main" }}>
          +${(option.priceCents / 100).toFixed(2)}
        </Typography>
      )}
    </Box>
  )
}