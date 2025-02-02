import React from "react";

export type ColorSchemeName = "light" | "dark";
export type ThemeStateType = "default" | "light" | "dark";

export interface ThemeContextType {
  preferredThemeType: ThemeStateType;
  currentColorSchemeName: ColorSchemeName;
  setPreferredTheme: (value: ThemeStateType) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  preferredThemeType: "default",
  currentColorSchemeName: "dark",
  setPreferredTheme: () => {
    return;
  },
});

export default ThemeContext;
