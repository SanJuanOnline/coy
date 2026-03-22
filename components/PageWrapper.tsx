"use client";

import { Box } from "@mui/material";
import { useTheme } from "@/lib/ThemeContext";
import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: theme === "dark" ? "#000000" : "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f5f3ff 100%)", 
      py: 4, 
      px: 2 
    }}>
      {children}
    </Box>
  );
}
