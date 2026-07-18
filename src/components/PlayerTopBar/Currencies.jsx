import {Stack, Box, Typography, LinearProgress, linearProgressClasses} from "@mui/material";

export default function Currencies({acorns, treats, flowers}) {
  const CurrencyCard = (currency, amount) => (
    <Box
      sx={{
        position: "relative"
      }}
    >
      {/* Rectangle */}
      <Box
        sx={{
          bgcolor: "var(--bubble-shadow)",
          borderRadius: 2,
          pl: "20%",
          pt: "0.5%",
          pr: "5%",
          pb: "0.5%",

          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Typography variant="body2" sx={{ color: "var(--cream)" }}>
          {amount}
        </Typography>
      </Box>

      {/* Circle */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          left: "-7.5%",

          width: "15%",
          aspectRatio: "1 / 1",

          bgcolor: "var(--cream)",
          
        }}
      >
        {currency}
      </Box>
    </Box>
  );

  return (
    <Stack spacing={1} sx={{width: "10vw"}}>
      {CurrencyCard("S", acorns)}
      {CurrencyCard("T", treats)}
      {CurrencyCard("F", flowers)}
    </Stack>
  )
};