import React, { useContext } from "react";
import ThemeContext, { ThemeStateType } from "@/store/theme-context";
import RadioButtons from "@/components/Ui/RadioButtons";

type ThemeOption = {
  label: string;
  value: ThemeStateType;
};

const options: ThemeOption[] = [
  { label: "ברירת המחדל של המערכת", value: "default" },
  { label: "בהיר", value: "light" },
  { label: "כהה", value: "dark" },
];

const ThemeSelect = () => {
  const themeCtx = useContext(ThemeContext);

  const handleThemeSelect = async (value: string) => {
    const selectedTheme = value as ThemeStateType;
    themeCtx.setPreferredTheme(selectedTheme);
  };

  return (
    <RadioButtons
      options={options}
      onValueChange={handleThemeSelect}
      selectedValue={themeCtx.preferredThemeType}
    />
  );
};

export default ThemeSelect;
