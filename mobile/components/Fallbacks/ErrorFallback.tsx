import { StyleSheet, View } from "react-native";
import React from "react";
import Text from "@/components/Ui/ThemedText";
import Button from "@/components/Ui/Button";
import * as Updates from "expo-updates";

const ErrorFallback = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>משהו השתבש</Text>
      <Text style={styles.text}>כדאי להפעיל מחדש את האפליקציה ולנסות שוב</Text>
      <Button
        onPress={async () => {
          await Updates.reloadAsync();
        }}
        style={styles.button}
        containerStyle={styles.buttonContainer}
      >
        <Text>הפעלה מחדש</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    margin: 12,
  },
  buttonContainer: {
    padding: 12,
  },
});

export default ErrorFallback;
