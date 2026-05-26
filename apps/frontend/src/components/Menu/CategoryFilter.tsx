import { Box, Typography, useTheme } from "@mui/material"

interface Props {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: Props) {
  const theme = useTheme()

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 6, flexWrap: "wrap" }}>
      {categories.map((cat: string) => (
        <Box
          key={cat}
          onClick={() => onChange(cat)}
          sx={{
            px: 2.5,
            py: 1,
            cursor: "pointer",
            border: `0.5px solid ${
              active === cat
                ? theme.palette.primary.main
                : "rgba(240,235,227,0.1)"
            }`,
            background:
              active === cat
                ? "rgba(232,160,69,0.08)"
                : "transparent",
            borderRadius: "2px",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color:
                active === cat
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {cat}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}