import { Box, Typography, useTheme } from "@mui/material"

export default function AppFooter() {
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 3, md: 6 },
        py: 3,
        borderTop: `0.5px solid ${theme.palette.divider}`,
      }}
    >

      {/* BRAND MESSAGE */}
      <Typography
        variant="caption"
        sx={{ color: theme.palette.text.disabled }}
      >
        fork & fire — kitchen open
      </Typography>

      {/* CREDIT */}
      <Typography
        variant="caption"
        sx={{ color: theme.palette.text.disabled }}
      >
        by Laura Usuga Quiñones
      </Typography>

    </Box>
  )
}