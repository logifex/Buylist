import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

const useBottomSheetRef = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  return {
    ref: bottomSheetModalRef,
    present: handlePresentModalPress,
    dismiss: handleDismissModalPress,
  };
};

export default useBottomSheetRef;
