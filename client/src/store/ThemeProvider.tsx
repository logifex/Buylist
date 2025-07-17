import { PropsWithChildren, useEffect, useState } from "react";
import ThemeContext, {
  ColorSchemeName,
  ThemeContextType,
  ThemeStateType,
} from "./theme-context";

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeStateType>("default");

  const deviceScheme: ColorSchemeName = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
  const scheme = selectedTheme !== "default" ? selectedTheme : deviceScheme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", scheme === "dark");
    document.documentElement.style.colorScheme = scheme;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        scheme === "dark" ? "#1e1e1e" : "#F57C00"
      );
    }
  }, [scheme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ColorSchemeName;

    if (storedTheme) {
      setSelectedTheme(storedTheme);
    }
  }, []);

  const setPreferredTheme = (newTheme: ThemeStateType) => {
    setSelectedTheme(newTheme);

    if (newTheme === "default") {
      localStorage.removeItem("theme");
      return;
    }
    localStorage.setItem("theme", newTheme);
  };

  const themeContext: ThemeContextType = {
    preferredThemeType: selectedTheme,
    currentColorSchemeName: scheme,
    setPreferredTheme: setPreferredTheme,
  };

  return <ThemeContext value={themeContext}>{children}</ThemeContext>;
};

export default ThemeProvider;
