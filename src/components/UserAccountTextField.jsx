import {TextField} from "@mui/material";

export default function UserAccountTextField({field}) {
  return (
    <TextField
      placeholder={field}
      variant="outlined"
      sx={{
        backgroundColor: "var(--cream)",
        borderRadius: 2,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: 2,
            borderWidth: 2,
            borderColor: "var(--brown)",
          },
          "&:hover fieldset": {
            borderColor: "var(--brown)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--brown)",
            borderWidth: 2.5,
          },
        },

        "& .MuiInputLabel-root": {
          color: "var(--brown)",
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--brown)",
        },

        "& input": {
          padding: 1,
          color: "var(--brown)",
        },

        "& input::placeholder": {
          color: "var(--light-brown)",
          opacity: 1
        },
      }}
    />
  );
}