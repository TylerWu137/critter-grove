import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito", sans-serif',

    h1: {
      fontFamily: '"Fredoka One", sans-serif',
      fontWeight: 400,
      fontSize: "3rem"
    },

    h2: {
      fontFamily: '"Fredoka One", sans-serif',
      fontWeight: 400,
      fontSize: "2.5rem"
    },

    h3: {
      fontFamily: '"Fredoka One", sans-serif',
      fontWeight: 300,
      fontSize: "1.5rem"
    },

    h4: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 550,
      fontSize: "1.1rem"
    },

    body1: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 300,
      fontSize: "1.2rem"
    },

    caption: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 300,
      fontSize: "1rem"
    },

    button: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 200,
      textTransform: "none", // Prevents ALL CAPS buttons
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: "none",
          fontSize: "1.3rem",
          color: "var(--cream)",
          backgroundColor: "var(--brown)"
        },
      },
      variants: [
        {
          props: { variant: "menu" },
          style: {
            backgroundColor: "var(--cream)",
            color: "var(--brown)",
            border: "2px solid var(--brown)",
            borderRadius: 8,
            fontSize: "1.3rem",
          },
        },
        {
          props: { variant: "menu2" },
          style: {
            backgroundColor: "var(--cream)",
            color: "var(--brown)",
            border: "2px solid var(--brown)",
            borderRadius: 8,
            fontSize: "1rem",
            whiteSpace: "nowrap",
          },
        },
      ],
    },
  },
});

export default theme;