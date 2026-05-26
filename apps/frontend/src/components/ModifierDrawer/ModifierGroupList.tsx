import { Box, Typography } from "@mui/material"
import ModifierOptionItem from "./ModifierOptionItem"

interface Props {
  groups: any[]
  selected: Record<string, any[]>
  onToggle: (group: any, option: any) => void
}

export default function ModifierGroupList({
  groups,
  selected,
  onToggle,
}: Props) {
  if (!groups?.length) return null

  return (
    <>
      {groups.map((group: any, i: number) => (
        <Box key={group.id} sx={{ mb: 4 }}>

          {/* GROUP TITLE */}
          <Typography variant="h6">
            {group.name}
          </Typography>

          {/* OPTIONS LIST */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {group.options.map((opt: any) => (
              <ModifierOptionItem
                key={opt.id}
                option={opt}
                group={group}
                selected={selected}
                onToggle={onToggle}
              />
            ))}
          </Box>

          {/* DIVIDER BETWEEN GROUPS */}
          {i < groups.length - 1 && (
            <Box
              sx={{
                mt: 3,
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              }}
            />
          )}

        </Box>
      ))}
    </>
  )
}