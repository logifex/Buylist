import { StyleSheet, View, Pressable } from "react-native";
import React, { useContext } from "react";
import ThemeContext from "@/store/theme-context";
import Text from "./ThemedText";

type RadioButtonOption = { label: string; value: string };

type Props = {
  options: RadioButtonOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

const RadioButtons = ({ options, selectedValue, onValueChange }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View>
      {options.map((option) => {
        return (
          <View key={option.value}>
            <Pressable
              style={({ pressed }) => [
                styles.pressable,
                pressed && { backgroundColor: theme.pressedColor },
              ]}
              onPress={() => onValueChange(option.value)}
            >
              <View style={styles.container}>
                <View style={[styles.outerIcon, { borderColor: theme.text }]}>
                  {selectedValue === option.value && (
                    <View
                      style={[
                        styles.innerIcon,
                        { backgroundColor: theme.text },
                      ]}
                    />
                  )}
                </View>
                <Text style={styles.text}>{option.label}</Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    padding: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerIcon: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerIcon: {
    width: 12,
    height: 12,
    borderRadius: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default RadioButtons;
