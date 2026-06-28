import {
  BackHandler,
  Keyboard,
  NativeEventSubscription,
  StyleSheet,
  View,
} from "react-native";
import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  BackdropPressBehavior,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Text from "./ThemedText";
import ThemeContext from "@/store/theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BottomModalProps = PropsWithChildren<{
  title?: string;
  enableDynamicSizing?: boolean;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  showHandle?: boolean;
  closeKeyboard?: boolean;
  onRequestClose: () => void;
  ref: React.RefObject<BottomSheetModal | null>;
}>;

const BackdropComponent = ({
  backdropBehavior,
  ...props
}: BottomSheetBackdropProps & { backdropBehavior: BackdropPressBehavior }) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    pressBehavior={backdropBehavior}
  />
);

const BottomModal = ({
  title,
  enableDynamicSizing = true,
  snapPoints,
  enablePanDownToClose = true,
  closeKeyboard = false,
  onRequestClose,
  children,
  ref,
}: BottomModalProps) => {
  const { theme } = useContext(ThemeContext);

  const [isShowing, setIsShowing] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let backHandler: NativeEventSubscription | undefined;

    if (isShowing) {
      if (closeKeyboard) {
        Keyboard.dismiss();
      }

      const backAction = () => {
        onRequestClose();
        return true;
      };

      backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
    }

    return () => {
      backHandler?.remove();
    };
  }, [isShowing, closeKeyboard, onRequestClose]);

  const handleSheetChanges = useCallback((index: number) => {
    setIsShowing(index < 0 ? false : true);
  }, []);

  const Container = enableDynamicSizing ? BottomSheetView : View;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onChange={handleSheetChanges}
      keyboardBlurBehavior="restore"
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustPan"
      style={{ marginLeft: insets.left, marginRight: insets.right }}
      handleIndicatorStyle={[
        styles.handleIndicator,
        {
          display: enablePanDownToClose ? "flex" : "none",
          backgroundColor: theme.text,
        },
      ]}
      backgroundStyle={[
        styles.background,
        {
          backgroundColor: theme.modalBackground,
        },
      ]}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={(props) =>
        BackdropComponent({
          ...props,
          backdropBehavior: enablePanDownToClose ? "close" : "none",
        })
      }
    >
      <Container style={[styles.fullSpace, { paddingBottom: insets.bottom }]}>
        {title && (
          <View style={[styles.header, { borderBottomColor: theme.hr }]}>
            <Text style={styles.text}>{title}</Text>
          </View>
        )}
        <View style={styles.fullSpace}>{children}</View>
      </Container>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 8,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  handleIndicator: {
    width: 40,
  },
  background: {
    borderRadius: 20,
  },
  fullSpace: {
    flex: 1,
  },
});

export default BottomModal;
