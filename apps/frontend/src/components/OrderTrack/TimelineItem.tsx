import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material"
import type { TimelineEvent } from "../../types/timeline/timeline"

interface Props {
  event: TimelineEvent
  expanded: boolean
  onToggle: () => void
}

export default function TimelineItem({
  event,
  expanded,
  onToggle,
}: Props) {
  const theme = useTheme()

  const formatDate = (date: string) =>
    new Date(date).toLocaleString()

  return (
    <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
            cursor: "pointer",
          }}
          onClick={onToggle}
        >
          <Typography sx={{ fontWeight: 500 }}>
            {event.type}
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {formatDate(event.timestamp)}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: theme.palette.primary.main }}
            >
              {expanded ? "▲ collapse" : "▼ details"}
            </Typography>
          </Box>
        </Box>

        {expanded && (
          <>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, display: "block", mb: 1 }}
            >
              Source: {event.source} · correlationId: {event.correlationId}
            </Typography>

            {event.payload && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: "4px",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                {Object.entries(event.payload).map(([key, value]) => (
                  <Typography key={key} variant="caption" sx={{ display: "block" }}>
                    {key}: {String(value)}
                  </Typography>
                ))}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}