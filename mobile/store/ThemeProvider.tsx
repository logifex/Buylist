import React, { PropsWithChildren, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import ThemeContext, {
  ThemeContextType,
  ThemeStateType,
} from "./theme-context";
import { Colors } from "@/constants/Colors";
import AppDataService from "@/services/AppDataService";
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
} from "@react-navigation/native";

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const deviceScheme = useColorScheme();

  const [selectedTheme, setSelectedTheme] = useState<ThemeStateType>("default");
  const { light, dark } = Colors;
  const scheme = selectedTheme !== "default" ? selectedTheme : deviceScheme;
  const isDark = scheme === "dark";
  const theme = isDark ? dark : light;

  useEffect(() => {
    const getStoredTheme = async () => {
      const storedTheme = await AppDataService.readTheme();
      if (storedTheme) {
        setSelectedTheme(storedTheme as ThemeStateType);
      }
    };

    getStoredTheme();
  }, []);

  const setPreferredTheme = (newTheme: ThemeStateType) => {
    setSelectedTheme(newTheme);

    if (newTheme === "default") {
      AppDataService.removeTheme();
      return;
    }
    AppDataService.writeTheme(newTheme);
  };

  const themeContext: ThemeContextType = {
    theme: theme,
    preferredThemeType: selectedTheme,
    currentColorSchemeName: scheme,
    setPreferredTheme: setPreferredTheme,
  };

  return (
    <NavigationThemeProvider
      value={{ dark: isDark, colors: theme, fonts: DefaultTheme.fonts }}
    >
      <ThemeContext.Provider value={themeContext}>
        {children}
      </ThemeContext.Provider>
    </NavigationThemeProvider>
  );
};

export default ThemeProvider;
