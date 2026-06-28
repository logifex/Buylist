import { StyleSheet } from "react-native";
import React from "react";
import Text from "@/components/Ui/ThemedText";
import Button from "@/components/Ui/Button";
import * as Updates from "expo-updates";
import PageContainer from "../Ui/PageContainer";

const ErrorFallback = () => {
  return (
    <PageContainer style={styles.container}>
      <Text style={styles.title}>משהו השתבש</Text>
      <Text style={styles.text}>כדאי להפעיל מחדש את האפליקציה ולנסות שוב</Text>
      <Button
        onPress={() => {
          void Updates.reloadAsync();
        }}
        style={styles.button}
        containerStyle={styles.buttonContainer}
      >
        <Text>הפעלה מחדש</Text>
      </Button>
    </PageContainer>
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
