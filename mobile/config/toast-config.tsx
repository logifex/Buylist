import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import Text from "@/components/Ui/ThemedText";

const toastConfig = {
  base: ({ text1 }: BaseToastProps) => (
    <View style={styles.baseToast}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  linkToast: () => (
    <View style={styles.baseToast}>
      <MaterialIcons name="link" size={24} color="#0088d1" />
      <Text style={[styles.text, styles.iconText]}>הקישור הועתק</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  baseToast: {
    backgroundColor: "rgb(48, 48, 48)",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  iconText: {
    marginStart: 4,
  },
});

export default toastConfig;
