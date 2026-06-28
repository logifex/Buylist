import { StyleSheet, View, Pressable } from "react-native";
import React from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface Props {
  startIconName: MaterialIconName;
  endIconName: MaterialIconName;
  startIconLabel: string;
  endIconLabel: string;
  onStartPress: () => void;
  onEndPress: () => void;
}

const ProductButtons = ({
  startIconName,
  endIconName,
  startIconLabel,
  endIconLabel,
  onStartPress,
  onEndPress,
}: Props) => {
  return (
    <View style={styles.buttonView}>
      <Pressable
        onPress={onStartPress}
        style={({ pressed }) => pressed && styles.pressedButton}
      >
        <MaterialIcons
          name={startIconName}
          size={48}
          color="black"
          accessibilityLabel={startIconLabel}
        />
      </Pressable>
      <Pressable
        onPress={onEndPress}
        style={({ pressed }) => pressed && styles.pressedButton}
      >
        <MaterialIcons
          name={endIconName}
          size={48}
          color="black"
          accessibilityLabel={endIconLabel}
        />
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
