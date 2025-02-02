import { StyleSheet, View, Pressable } from "react-native";
import React, { useContext } from "react";
import ThemeContext from "@/store/theme-context";
import Text from "./ThemedText";

type Props = {
  startComponent?: JSX.Element;
  text: string;
  onPress: () => void;
};

const MenuItem = ({ startComponent, text, onPress }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        pressed && { backgroundColor: theme.pressedColor }
      }
    >
      <View style={styles.container}>
        {startComponent}
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  text: {
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default MenuItem;
