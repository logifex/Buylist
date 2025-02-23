import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React, { PropsWithChildren, useContext } from "react";
import ThemeContext from "@/store/theme-context";

export type ButtonType = "normal" | "primary" | "empty";

type Props = PropsWithChildren<{
  onPress: () => void;
  disabled?: boolean;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}>;

const Button = ({
  onPress,
  disabled = false,
  type = "normal",
  style,
  containerStyle,
  children,
}: Props) => {
  const { theme } = useContext(ThemeContext);

  let typeStyle = {
    backgroundColor: theme.card,
    borderColor: theme.card,
  };

  if (type === "primary") {
    typeStyle.backgroundColor = theme.primary;
    typeStyle.borderColor = theme.primary;
  } else if (type === "empty") {
    typeStyle.backgroundColor = theme.emptyButton;
    typeStyle.borderColor = theme.text;
  }

  return (
    <Pressable style={style} onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <View
          style={[
            styles.container,
            typeStyle,
            containerStyle,
            pressed && styles.pressed,
          ]}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Button;
