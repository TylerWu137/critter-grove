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

    h23: {
      fontFamily: '"Fredoka One", sans-serif',
      fontWeight: 400,
      fontSize: "2rem"
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

    body2: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 300,
      fontSize: "1.1rem"
    },

    body3: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 300,
      fontSize: "0.8rem"
    },

    text: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 500,
      fontSize: "1rem"
    },

    caption: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 300,
      fontSize: "1rem"
    },

    xs: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 200,
      fontSize: "0.5rem"
    },

    button: {
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 200,
      textTransform: "none", // Prevents ALL CAPS buttons
    },
  },

  components: {
    MuiTypography: {
      defaultProps: {
        color: "inherit",
      },
    },
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
          backgroundColor: "var(--brown)",
          height: "fit-content",
          transition: "color 200ms ease, border-color 200ms ease, background-color 200ms ease",
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

            "&:hover": {
              color: "var(--yellow)",
              borderColor: "var(--yellow)",
            },
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
            
            "&:hover": {
              color: "var(--yellow)",
              borderColor: "var(--yellow)",
            },
          },
        },
        {
          props: { variant: "action" },
          style: {
            backgroundColor: "var(--cream)",
            color: "var(--brown)",
            border: "1.5px solid var(--brown)",
            padding: 1,
            borderRadius: 8,
            fontSize: "1.2rem",

            "&:hover": {
              color: "var(--yellow)",
              borderColor: "var(--yellow)",
            },
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: "var(--brown)",
          backgroundColor: "var(--cream)",
          borderWidth: 1.5,

          "& .MuiOutlinedInput-input": {
            fontFamily: '"Nunito", sans-serif',
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--brown)",

            "&::placeholder": {
              color: "var(--light-brown)",
            },
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--light-brown)",
            borderWidth: 1.5,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--brown)",
            borderWidth: 1.5,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--brown)",
            borderWidth: 2,
          },
          "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--brown)",
            borderWidth: 2,
          },

          // ★ ADDED — without this, hovering a disabled field would still
          // pick up the plain "&:hover" rule above and turn brown, even
          // though the field isn't interactive. This reverts it back to
          // the same look as the default, non-hover, non-disabled state.
          "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--light-brown)",
            borderWidth: 1.5,
          },

          "& input": {
            color: "var(--brown)",
            px: 6,
            py: 2
          },
        },
      },
    },
  },
});

export default theme;