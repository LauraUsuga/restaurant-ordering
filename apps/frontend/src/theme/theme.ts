import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#D4A373",
      light: "#E6B98A",
      dark: "#A8744F",
      contrastText: "#0B0B0F",
    },

    secondary: {
      main: "#8E6C88",
      light: "#B39AB0",
      dark: "#5E4A5B",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#0B0B0F",
      paper: "#141418",
    },

    text: {
      primary: "#F5F1E8",
      secondary: "#B8B2A7",
    },
  },

  typography: {
    fontFamily: [
      "Playfair Display",
      "Georgia",
      "serif",
    ].join(","),

    h1: {
      fontSize: "3rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },

    h2: {
      fontSize: "2.25rem",
      fontWeight: 500,
    },

    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#B8B2A7",
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(212,163,115,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(142,108,136,0.08), transparent 45%)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "10px 18px",
          fontWeight: 500,
          transition: "all 0.25s ease",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#141418",
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          border: "1px solid rgba(212,163,115,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(11,11,15,0.7)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(212,163,115,0.1)",
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "0.01em",
        },
      },
    },
  },
});