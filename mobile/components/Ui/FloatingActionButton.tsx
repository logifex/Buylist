import React from "react";
import { PropsWithChildren } from "react";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";

type Props = PropsWithChildren<{
  onPress: () => void;
  color: ColorValue;
}>;

const FloatingActionButton = ({ onPress, color, children }: Props) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            { backgroundColor: color },
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
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 32,
    opacity: 1,
    backgroundColor: "black",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 12,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 12, height: 12 },
  },
  pressed: {
    opacity: 0.75,
  },
});

export default FloatingActionButton;
