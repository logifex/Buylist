import { StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import ThemeContext from "@/store/theme-context";
import DialogPrompt from "./DialogPrompt";
import Text from "../ThemedText";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";

type Props = BottomSheetTextInputProps & {
  name: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
  validators?: [
    { validate: (input: string) => boolean; invalidMessage: string },
  ];
};

const InputPrompt = ({
  name,
  onConfirm,
  onClose,
  defaultValue,
  validators,
  ...rest
}: Props) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? "");
  const [validation, setValidation] = useState({ isValid: true, message: "" });

  const { theme } = useContext(ThemeContext);

  const handleInputChanged = (newInput: string) => {
    setInputValue(newInput);
    setValidation({ isValid: true, message: "" });
  };

  const handleConfirm = () => {
    const submitValue = inputValue.trim();

    if (submitValue.length === 0) {
      setValidation({ isValid: false, message: `${name} לא יכול להיות ריק` });

      return;
    }

    validators?.forEach((validator) => {
      if (!validator.validate(inputValue)) {
        setValidation({ isValid: false, message: validator.invalidMessage });

        return;
      }
    });

    if (inputValue !== defaultValue) {
      onConfirm(submitValue);
    }
    onClose();
  };

  return (
    <DialogPrompt
      onConfirm={handleConfirm}
      onClose={onClose}
      closeOnButton={false}
    >
      {!validation.isValid && (
        <Text style={{ color: theme.danger }}>{validation.message}</Text>
      )}
      <BottomSheetTextInput
        placeholder={name}
        placeholderTextColor={theme.placeholder}
        onChangeText={handleInputChanged}
        defaultValue={defaultValue}
        {...rest}
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.placeholder },
          !validation.isValid && { borderColor: theme.danger },
        ]}
      />
    </DialogPrompt>
  );
};

export default InputPrompt;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    width: 200,
    padding: 8,
    textAlign: "center",
  },
});
