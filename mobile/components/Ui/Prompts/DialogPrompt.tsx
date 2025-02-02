import { View } from "react-native";
import React, { PropsWithChildren } from "react";
import Button, { ButtonType } from "../Button";
import { StyleSheet } from "react-native";
import Text from "../ThemedText";

type Props = PropsWithChildren<{
  onConfirm: () => void;
  onSecondary?: () => void;
  onClose: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  secondaryTitle?: string;
  cancelType?: ButtonType;
  secondaryType?: ButtonType;
  closeOnButton?: boolean;
}>;

const DialogPrompt = ({
  onConfirm,
  onClose,
  onSecondary,
  confirmTitle = "אישור",
  cancelTitle = "ביטול",
  secondaryTitle,
  cancelType = "empty",
  secondaryType = "empty",
  closeOnButton = true,
  children,
}: Props) => {
  const handleConfirm = () => {
    onConfirm();

    if (closeOnButton) {
      onClose();
    }
  };

  const handleSecondary = () => {
    if (!onSecondary) {
      return;
    }

    onSecondary();

    if (closeOnButton) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.buttons}>
        <Button
          containerStyle={styles.button}
          onPress={handleCancel}
          type={cancelType}
        >
          <Text style={cancelType === "primary" && styles.primaryText}>
            {cancelTitle}
          </Text>
        </Button>
        <View style={styles.options}>
          {secondaryTitle && (
            <Button
              style={styles.secondaryButton}
              containerStyle={styles.button}
              onPress={handleSecondary}
              type={secondaryType}
            >
              <Text style={secondaryType === "primary" && styles.primaryText}>
                {secondaryTitle}
              </Text>
            </Button>
          )}
          <Button
            containerStyle={styles.button}
            onPress={handleConfirm}
            type="primary"
          >
            <Text style={styles.primaryText}>{confirmTitle}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    width: "100%",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  options: {
    flexDirection: "row",
  },
  secondaryButton: {
    marginRight: 16,
  },
  primaryText: {
    color: "black",
  },
});

export default DialogPrompt;
