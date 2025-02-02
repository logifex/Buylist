import { Text, type TextProps } from "react-native";

import { useContext } from "react";
import ThemeContext from "@/store/theme-context";

export type ThemedTextProps = TextProps;

function ThemedText({ style, ...rest }: ThemedTextProps) {
  const { theme } = useContext(ThemeContext);

  return <Text style={[{ color: theme.text }, style]} {...rest} />;
}

export default ThemedText;
