import { Stack, Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { shopItems } from "../../data/shopItems"

import ShopItemCard from "./ShopItemCard"

export default function ShopView({ value: valueProp, onChange, category }) {


  const sectionItems = shopItems.filter((list) =>
    list.category === category
  );

  const [internalTab, setInternalTab] = useState(sectionItems[0].subcategory);
  const handleChange = (_, newValue) => {
    setInternalTab(newValue);
  };

  return (
    <Stack spacing={2} sx={{width: "100%"}}>
      <Tabs
        value={internalTab}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        sx={{
          borderBottom: "2px solid var(--light-brown)",

          "& .MuiTabs-indicator": {
            backgroundColor: "var(--brown)",
            height: "2px", // optional
          },

          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: "auto",

            "& .MuiTypography-root": {
              color: "var(--light-brown)",
            },

            "&.Mui-selected .MuiTypography-root": {
              color: "var(--brown)",
            },
          },
        }}
      >
        {sectionItems.map((list) => (
          <Tab
          disableRipple
          key={list.subcategory}
          value={list.subcategory}
          label={<Typography variant="h4">{list.subcategory}</Typography>}
          />
        ))}
      </Tabs>
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden", px: 1 }}>
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
          sx={{
            flex: 1, minHeight: 0, overflowY: "scroll",
            pr: 1,
            alignItems: "flex-start", // aligns items within each row to the top
            alignContent: "flex-start", // ★ ADDED — stops rows themselves from stretching apart to fill leftover vertical space when there are few critters/rows
            "&::-webkit-scrollbar": {
              width: 10,
              borderColor: "var(--brown)",
              borderWidth: 100,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "var(--cream)",
              border: "2px solid var(--brown)",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--red)",
              border: "2px solid transparent",
              backgroundClip: "padding-box",
              borderRadius: "999px",
            },
          }}
        >
          {sectionItems.find((list) => list.subcategory === internalTab).items.map((item) => {
            return (
              <Grid size={4} key={item.key}>
                <ShopItemCard
                  item={item}
                />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Stack>
  );
}