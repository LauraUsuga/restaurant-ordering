import { Box, Typography, useTheme } from "@mui/material"

export default function MenuPageHeader() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        mb: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Box>

        {/* SMALL LABEL */}
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.main,
            letterSpacing: "0.16em",
            display: "block",
            mb: 1.5,
          }}
        >
          SEASONAL MENU
        </Typography>

        {/* MAIN TITLE */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.2rem", md: "3rem" },
            lineHeight: 1.1,
          }}
        >
          What calls <br />
          <em style={{ color: theme.palette.primary.main }}>
            to you
          </em>{" "}
          today?
        </Typography>

      </Box>
    </Box>
  )
}