import { Box, Typography, useTheme } from "@mui/material";

export default function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const theme = useTheme()
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2,
        py: 1,
        cursor: "pointer",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: active ? "20px" : "0px",
          height: "1px",
          background: theme.palette.primary.main,
          transition: "width 0.3s ease",
        },
      }}
    >
      <Typography variant="caption" sx={{
        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontSize: "0.7rem",
        fontWeight: 500,
        transition: "color 0.2s",
      }}>
        {label}
      </Typography>
    </Box>
  )
}
