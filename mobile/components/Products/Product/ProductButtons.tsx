import { StyleSheet, View, Pressable } from "react-native";
import React from "react";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

type MaterialIconName = React.ComponentProps<typeof MaterialIcon>["name"];

type Props = {
  startIconName: MaterialIconName;
  endIconName: MaterialIconName;
  onStartPress: () => void;
  onEndPress: () => void;
};

const ProductButtons = ({
  startIconName,
  endIconName,
  onStartPress,
  onEndPress,
}: Props) => {
  return (
    <View style={styles.buttonView}>
      <Pressable
        onPress={onStartPress}
        style={({ pressed }) => pressed && styles.pressedButton}
      >
        <MaterialIcon name={startIconName} size={48} color="black" />
      </Pressable>
      <Pressable
        onPress={onEndPress}
        style={({ pressed }) => pressed && styles.pressedButton}
      >
        <MaterialIcon name={endIconName} size={48} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
  },
  pressedButton: {
    opacity: 0.5,
  },
});

export default ProductButtons;
