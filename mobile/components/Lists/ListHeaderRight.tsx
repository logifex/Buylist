import { StyleSheet, View } from "react-native";
import HeaderButton from "../Ui/HeaderButton";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";

interface Props {
  invitationPresent: () => void;
  colorPickPresent: () => void;
  menuPresent: () => void;
  theme: typeof Colors.light;
}

const ListHeaderRight = ({
  invitationPresent,
  colorPickPresent,
  menuPresent,
  theme,
}: Props) => (
  <View style={styles.container}>
    <HeaderButton onPress={invitationPresent}>
      <MaterialIcon name="person-add-alt-1" size={24} color={theme.text} />
    </HeaderButton>
    <HeaderButton onPress={colorPickPresent}>
      <MaterialIcon name="color-lens" size={24} color={theme.text} />
    </HeaderButton>
    <HeaderButton onPress={menuPresent} first>
      <MaterialIcon name="menu" size={24} color={theme.text} />
    </HeaderButton>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default ListHeaderRight;
