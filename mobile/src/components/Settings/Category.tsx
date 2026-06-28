import { StyleSheet, View } from "react-native";
import React, { PropsWithChildren, useContext } from "react";
import Text from "@/components/Ui/ThemedText";
import ThemeContext from "@/store/theme-context";

type Props = PropsWithChildren<{
  title: string;
}>;

const Category = ({ title, children }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View>
      <View style={[styles.header, { borderBottomColor: theme.hr }]}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    margin: 8,
  },
});

export default Category;
