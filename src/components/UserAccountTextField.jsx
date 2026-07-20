import { TextField } from "@mui/material";

export default function UserAccountTextField({
  field,
  type = "text",
  value,
  onChange,
  error = false,
  helperText,
}) {
  return (
    <TextField
      placeholder={field}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth
    />
  );
}