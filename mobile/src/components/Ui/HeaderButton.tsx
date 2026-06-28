import React, { PropsWithChildren, useContext } from "react";
import { Pressable, StyleSheet } from "react-native";
import ThemeContext from "@/store/theme-context";

type Props = PropsWithChildren<{
  onPress: () => void;
}>;

const HeaderButton = ({ onPress, children }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && { backgroundColor: theme.pressedColor },
      ]}
      onPress={onPress}
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
});

export default HeaderButton;
