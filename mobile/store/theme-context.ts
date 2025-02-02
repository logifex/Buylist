import { Colors } from "@/constants/Colors";
import React from "react";
import { ColorSchemeName } from "react-native";

export type ThemeStateType = "default" | "light" | "dark";

export type ThemeContextType = {
  theme: typeof Colors.light;
  preferredThemeType: ThemeStateType;
  currentColorSchemeName: ColorSchemeName;
  setPreferredTheme: (value: ThemeStateType) => void;
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: Colors.light,
  preferredThemeType: "default",
  currentColorSchemeName: "light",
  setPreferredTheme: () => {},
});

export default ThemeContext;
