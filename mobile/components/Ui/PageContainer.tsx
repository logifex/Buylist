import { View, ViewStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

const PageContainer = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        { flex: 1, paddingLeft: insets.left, paddingRight: insets.right },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default PageContainer;
