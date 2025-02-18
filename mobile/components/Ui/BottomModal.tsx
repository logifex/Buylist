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

export type BottomModalProps = PropsWithChildren<{
  title?: string;
  snapPoints: (string | number)[];
  backdropBehavior?: BackdropPressBehavior;
  showHandle?: boolean;
  closeKeyboard?: boolean;
  onRequestClose: () => void;
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

const BottomModal = React.forwardRef<BottomSheetModal, BottomModalProps>(
  function BottomModal(
    {
      title,
      snapPoints,
      backdropBehavior = "close",
      showHandle = true,
      closeKeyboard = false,
      onRequestClose,
      children,
    },
    ref,
  ) {
    const { theme } = useContext(ThemeContext);

    const [isShowing, setIsShowing] = useState(false);

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

    return (
      <View>
        <BottomSheetModal
          ref={ref}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChanges}
          keyboardBlurBehavior="restore"
          keyboardBehavior="interactive"
          android_keyboardInputMode="adjustPan"
          handleIndicatorStyle={[
            styles.handleIndicator,
            {
              display: showHandle ? "flex" : "none",
              backgroundColor: theme.text,
            },
          ]}
          backgroundStyle={[
            styles.background,
            { backgroundColor: theme.modalBackground },
          ]}
          enablePanDownToClose
          backdropComponent={(props) =>
            BackdropComponent({ ...props, backdropBehavior: backdropBehavior })
          }
        >
          <BottomSheetView style={styles.fullSpace}>
            {title && (
              <View style={[styles.header, { borderBottomColor: theme.hr }]}>
                <Text style={styles.text}>{title}</Text>
              </View>
            )}
            <View style={styles.fullSpace}>{children}</View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    );
  },
);

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
