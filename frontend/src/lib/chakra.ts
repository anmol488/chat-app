import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: "#1E88E5",
        200: "#1565C0",
      },
    },
    styles: {
      global: () => ({
        body: {
          bg: "blackAlpha.100",
        },
      }),
    },
  }
);
