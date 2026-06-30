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
      fontSize: "2rem"
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
});

export default theme;