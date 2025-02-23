import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { PropsWithChildren, useContext } from "react";
import ThemeContext from "@/store/theme-context";

type Props = PropsWithChildren<{
  onPress: () => void;
  first?: boolean;
}>;

const HeaderButton = ({ onPress, first = false, children }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        first && styles.firstButton,
        pressed && { backgroundColor: theme.pressedColor },
      ]}
      onPressOut={onPress}
      hitSlop={4}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 32,
    padding: 8,
  },
  firstButton: {
    marginRight: -4,
  },
});

export default HeaderButton;
